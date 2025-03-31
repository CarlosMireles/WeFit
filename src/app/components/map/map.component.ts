import { Component, OnInit, OnDestroy, Injector, ApplicationRef, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { CommunicationService } from '../../services/CommunicationService';
import { Subscription } from 'rxjs';
import { EventMarkerComponent } from '../event-marker/event-marker.component';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: Map;
  eventCreationMode = false;
  private subscriptions: Subscription[] = [];
  private markerComponents: ComponentRef<any>[] = [];

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
    this.captureLocationFromClick()
    this.displayEvents()
  }

  ngOnDestroy(): void {

    this.subscriptions.forEach(sub => sub.unsubscribe());

    this.markerComponents.forEach(componentRef => {
      componentRef.destroy();
    });
  }

  private checkEventCreated(){
    this.subscriptions.push(
      this.communicationService.eventCreated$.subscribe(mode => {
        this.displayEvents();
        console.log('Refresh eventos', mode);
      })
    );
  }

  private checkEventCreationMode(){
    this.subscriptions.push(
      this.communicationService.eventCreationMode$.subscribe(mode => {
        this.eventCreationMode = mode;
        console.log('Modo receptivo cambiado a:', mode);
      })
    );
  }

  private captureLocationFromClick(){
    this.map.on('click', (evt) => {
      if (this.eventCreationMode) {
        const coordinates = toLonLat(evt.coordinate);
        console.log('Clic en mapa detectado en modo receptivo:', coordinates);
        this.communicationService.notifyMapClick({ lat: coordinates[1], lon: coordinates[0] });
      }
    });
  }

  async displayEvents() {
    let events: Promise<any[]> = this.eventApi.getEvents();
    for (let event of await events) {
      this.addCustomMarker(
        event.longitude,
        event.latitude,
        event.title,
        event.privacy || 'Público',
        event.image_url || ''
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
          this.map.getView().setCenter(fromLonLat([lon, lat]));
          this.map.getView().setZoom(14);
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada en este navegador.');
    }
  }

  private addCustomMarker(lon: number, lat: number, titulo: string, privacidad: string = 'publico', imagenUrl: string = ''): void {
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
      stopEvent: true
    });

    this.map.addOverlay(overlay);

    this.markerComponents.push(componentRef);

    componentRef.instance.clicked.subscribe((event: any) => {
      console.log('Marcador clickeado:', event);
    });
  }
}
