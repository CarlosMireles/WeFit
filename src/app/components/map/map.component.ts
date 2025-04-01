import { Component, OnInit, OnDestroy, Injector, ApplicationRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Subscription } from 'rxjs';

import { CommunicationService } from '../../services/CommunicationService';
import { EventService } from '../../services/event.service';
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
  selectedEvent: any = null; // Almacena el evento seleccionado para mostrar el modal

  // URL del icono para tu ubicación (archivo en assets)
  myLocationIconUrl: string = '/assets/user-pin.svg';

  private subscriptions: Subscription[] = [];
  private markerComponents: ComponentRef<any>[] = [];
  // Overlay para la ubicación actual
  private currentLocationOverlay!: Overlay;

  constructor(
    private communicationService: CommunicationService,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private eventApi: EventService,
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.setCurrentLocation();
    this.checkEventCreationMode();
    this.checkEventCreated();
    this.captureLocationFromClick();
    this.displayEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.markerComponents.forEach(componentRef => {
      componentRef.destroy();
    });
  }

  private checkEventCreated() {
    this.subscriptions.push(
      this.communicationService.eventCreated$.subscribe(mode => {
        this.displayEvents();
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

  async displayEvents() {
    const events = await this.eventApi.getEvents();
    // Eliminamos marcadores previos para evitar duplicados
    this.markerComponents.forEach(compRef => compRef.destroy());
    this.markerComponents = [];

    for (let event of events) {
      this.addCustomMarker(
        event.longitude,
        event.latitude,
        event.title,
        event.privacy || 'Público',
        event.image_url || '',
        event // Se pasa el objeto completo del evento
      );
    }
  }

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      controls: [],
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
      })
    });
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // Centramos el mapa en tu ubicación
          this.map.getView().setCenter(fromLonLat([lon, lat]));
          this.map.getView().setZoom(14);
          // Añadimos el overlay de la ubicación actual
          this.addCurrentLocationMarker(lon, lat);
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada en este navegador.');
    }
  }

  private addCurrentLocationMarker(lon: number, lat: number): void {
    console.log('Agregando ubicación actual en:', lon, lat);
    if (this.currentLocationOverlay) {
      this.currentLocationOverlay.setPosition(fromLonLat([lon, lat]));
      return;
    }
    // Creamos un contenedor para el icono de ubicación
    const element = document.createElement('div');
    element.className = 'current-location-marker';
    const img = document.createElement('img');
    img.src = this.myLocationIconUrl;
    // Ajusta el tamaño del icono según lo necesites
    img.style.width = '30px';
    img.style.height = '30px';
    element.appendChild(img);

    // Usamos "bottom-center" para que la parte inferior del icono se alinee con la ubicación
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
    // Creamos el componente marcador de evento
    const factory = this.componentFactoryResolver.resolveComponentFactory(EventMarkerComponent);
    const componentRef = factory.create(this.injector);

    // Asignamos las propiedades
    componentRef.instance.title = titulo;
    componentRef.instance.coordinates = { lon, lat };
    componentRef.instance.privacy = privacidad;
    componentRef.instance.image_url = imagenUrl;

    componentRef.changeDetectorRef.detectChanges();
    this.applicationRef.attachView(componentRef.hostView);

    // Creamos un contenedor para el marcador
    const element = document.createElement('div');
    element.className = 'event-marker-container';
    element.appendChild(componentRef.location.nativeElement);

    // Creamos un overlay para ubicar el marcador en el mapa
    const overlay = new Overlay({
      element: element,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
      offset: [0, 0],
      stopEvent: true
    });
    this.map.addOverlay(overlay);
    this.markerComponents.push(componentRef);

    // Al hacer clic en la chincheta se asigna el objeto completo del evento para mostrar el modal
    componentRef.instance.clicked.subscribe(() => {
      console.log('Marcador clickeado:', eventData);
      this.selectedEvent = eventData;
    });
  }
}
