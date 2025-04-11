import { Component, OnInit, OnDestroy, Injector, ApplicationRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Subscription } from 'rxjs';

import { CommunicationService } from '../../services/CommunicationService';
import { EventService, EventFilters } from '../../services/event.service';
import { EventMarkerComponent } from '../event-marker/event-marker.component';
import { EventViewComponent } from '../event-view/event-view.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, EventViewComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: Map;
  eventCreationMode = false;
  selectedEvent: any = null;
  myLocationIconUrl: string = '/assets/user-pin.svg';

  // Inicialmente sin filtros: se muestran todos los eventos.
  eventFilters: EventFilters = {
    date: '',
    hourMinimum: '',
    hourMaximum: '',
    sport: '',
    maxParticipants: undefined,
    privacy: ''
  };

  private subscriptions: Subscription[] = [];
  private markerComponents: ComponentRef<any>[] = [];
  private currentLocationOverlay!: Overlay;
  private geoWatchId: number | null = null;

  constructor(
    private communicationService: CommunicationService,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private eventApi: EventService,
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.watchCurrentLocation();
    this.checkEventCreationMode();
    this.checkEventCreated();
    this.captureLocationFromClick();
    this.displayFilteredEvents();

    // Suscribirse a filtros aplicados para actualizar los eventos mostrados
    this.subscriptions.push(
      this.communicationService.filterApplied$.subscribe((filters: EventFilters) => {
        console.log('Nuevos filtros recibidos en el mapa:', filters);
        this.eventFilters = filters;
        this.displayFilteredEvents();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.markerComponents.forEach(componentRef => componentRef.destroy());
    if (this.geoWatchId !== null) {
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
  }

  private checkEventCreated() {
    this.subscriptions.push(
      this.communicationService.eventCreated$.subscribe(mode => {
        this.displayFilteredEvents();
        console.log('Refresh eventos', mode);
      })
    );
  }

  private checkEventCreationMode() {
    this.subscriptions.push(
      this.communicationService.eventCreationMode$.subscribe(mode => {
        this.eventCreationMode = mode;
        console.log('Modo receptivo cambiado a:', mode);
      })
    );
  }

  private captureLocationFromClick() {
    this.map.on('click', (evt) => {
      if (this.eventCreationMode) {
        const coordinates = toLonLat(evt.coordinate);
        console.log('Clic en mapa detectado en modo receptivo:', coordinates);
        this.communicationService.notifyMapClick({ lat: coordinates[1], lon: coordinates[0] });
      }
    });
  }

  async displayFilteredEvents() {
    const events = await this.eventApi.getFilteredEvents(this.eventFilters);
    this.markerComponents.forEach(compRef => compRef.destroy());
    this.markerComponents = [];

    for (let event of events) {
      this.addCustomMarker(
        event.longitude,
        event.latitude,
        event.title,
        event.privacy || 'Público',
        event.image_url || '',
        event
      );
    }
  }

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      controls: [],
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
      })
    });
  }

  private watchCurrentLocation(): void {
    if ('geolocation' in navigator) {
      this.geoWatchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.map.getView().setCenter(fromLonLat([lon, lat]));
          this.map.getView().setZoom(14);
          this.addOrUpdateCurrentLocationMarker(lon, lat);
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      console.error('Geolocalización no soportada en este navegador.');
    }
  }

  private addOrUpdateCurrentLocationMarker(lon: number, lat: number): void {
    console.log('Actualizando ubicación actual en:', lon, lat);
    if (this.currentLocationOverlay) {
      this.currentLocationOverlay.setPosition(fromLonLat([lon, lat]));
      return;
    }
    const element = document.createElement('div');
    element.className = 'current-location-marker';
    const img = document.createElement('img');
    img.src = this.myLocationIconUrl;
    img.style.width = '30px';
    img.style.height = '30px';
    element.appendChild(img);

    this.currentLocationOverlay = new Overlay({
      element: element,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
      offset: [0, 0],
      stopEvent: false
    });
    this.map.addOverlay(this.currentLocationOverlay);
  }

  private addCustomMarker(
    lon: number,
    lat: number,
    titulo: string,
    privacidad: string,
    imagenUrl: string,
    eventData: any
  ): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(EventMarkerComponent);
    const componentRef = factory.create(this.injector);

    componentRef.instance.title = titulo;
    componentRef.instance.coordinates = { lon, lat };
    componentRef.instance.privacy = privacidad;
    componentRef.instance.image_url = imagenUrl;

    componentRef.changeDetectorRef.detectChanges();
    this.applicationRef.attachView(componentRef.hostView);

    const element = document.createElement('div');
    element.className = 'event-marker-container';
    element.appendChild(componentRef.location.nativeElement);

    const overlay = new Overlay({
      element: element,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
      offset: [0, 0],
      stopEvent: true
    });
    this.map.addOverlay(overlay);
    this.markerComponents.push(componentRef);

    componentRef.instance.clicked.subscribe(() => {
      console.log('Marcador clickeado:', eventData);
      this.selectedEvent = eventData;
    });
  }
}
