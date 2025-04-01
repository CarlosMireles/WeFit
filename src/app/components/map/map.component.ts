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
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Destruir todos los componentes de marcadores creados
    this.markerComponents.forEach(componentRef => {
      componentRef.destroy();
    });
  }

  private checkEventCreated(){
    // Suscribirse al modo receptivo
    this.subscriptions.push(
      this.communicationService.eventCreated$.subscribe(mode => {
        this.displayEvents();
        console.log('Refresh eventos', mode);
      })
    );
  }

  private checkEventCreationMode(){
    // Suscribirse al modo receptivo
    this.subscriptions.push(
      this.communicationService.eventCreationMode$.subscribe(mode => {
        this.eventCreationMode = mode;
        console.log('Modo receptivo cambiado a:', mode);
      })
    );
  }

  private captureLocationFromClick(){
    // Escuchar eventos de "click en mapa"
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
        event.privacy || 'Público', // Valor por defecto si no se proporciona
        event.image_url || ''        // Valor por defecto si no se proporciona
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
    // Crear dinámicamente un componente de marcador
    const factory = this.componentFactoryResolver.resolveComponentFactory(EventMarkerComponent);
    const componentRef = factory.create(this.injector);

    // Establecer propiedades del componente
    componentRef.instance.title = titulo;
    componentRef.instance.coordinates = { lon, lat };
    componentRef.instance.privacy = privacidad;
    componentRef.instance.image_url = imagenUrl;

    // Aplicar detección de cambios
    componentRef.changeDetectorRef.detectChanges();

    // Añadir el componente a la aplicación
    this.applicationRef.attachView(componentRef.hostView);

    // Crear un elemento HTML para el overlay y adjuntar el componente a él
    const element = document.createElement('div');
    element.className = 'event-marker-container';
    element.appendChild(componentRef.location.nativeElement);

    // Crear un overlay de OpenLayers con el elemento del componente
    const overlay = new Overlay({
      element: element,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
      stopEvent: true
    });

    // Añadir el overlay al mapa
    this.map.addOverlay(overlay);

    // Almacenar la referencia al componente para limpieza
    this.markerComponents.push(componentRef);

    // Añadir evento de clic al componente del marcador
    componentRef.instance.clicked.subscribe((event: any) => {
      console.log('Marcador clickeado:', event);
      // Aquí puedes manejar eventos del marcador
    });
  }
}
