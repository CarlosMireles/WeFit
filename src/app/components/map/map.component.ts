// src/app/pages/map/map.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';
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
  myLocationIconUrl = '/assets/user-pin.svg';

  eventFilters: EventFilters = {
    date: '',
    hourMaximum: '',
    hourMinimum: '',
    sport: '',
    maxParticipants: undefined,
    privacy: ''
  };

  private subs: Subscription[] = [];
  private markers: ComponentRef<any>[] = [];
  private currentLocationOverlay!: Overlay;

  constructor(
    private comm: CommunicationService,
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver,
    private eventApi: EventService
  ) {}

  /* ─────────────────────────────────────────────── */

  async ngOnInit(): Promise<void> {
    this.initMap();

    /* ¿Hay un evento previamente seleccionado? */
    const last = this.comm.lastSelected;

    /* Dibujamos siempre la chincheta del usuario.
       Solo centramos en ella si NO hay selección previa.      */
    this.captureInitialLocation(!last);   // 👈 nuevo parámetro

    /* Si venimos desde una tarjeta o un marcador, abrimos ese evento */
    if (last) {
      await this.centerAndOpenEvent(last.id, last.latitude, last.longitude);
    }

    /* Suscripciones */
    this.subs.push(
      this.comm.eventSelected$.subscribe(ev => {
        if (!ev) return;
        this.centerAndOpenEvent(ev.id, ev.latitude, ev.longitude);
      }),

      this.comm.filterApplied$.subscribe(f => {
        this.eventFilters = f;
        this.loadMarkers();
      }),

      this.comm.eventCreationMode$.subscribe(m => (this.eventCreationMode = m)),

      this.comm.eventCreated$.subscribe(() => this.loadMarkers())
    );

    /* Clic en mapa (modo creación) */
    this.map.on('click', evt => {
      if (!this.eventCreationMode) return;
      const [lon, lat] = toLonLat(evt.coordinate);
      this.comm.notifyMapClick({ lat, lon });
    });

    this.loadMarkers();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.markers.forEach(m => m.destroy());
  }

  /* ───────────────────────── Configuración mapa ── */

  private initMap() {
    this.map = new Map({
      target: 'map',
      controls: [],
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: fromLonLat([0, 0]), zoom: 2 })
    });
  }

  /** Localiza al usuario y, opcionalmente, centra el mapa en él */
  private captureInitialLocation(centerOnUser = true) {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lon = pos.coords.longitude;
        const lat = pos.coords.latitude;

        /* Dibujamos (o actualizamos) la chincheta de “mi ubicación” */
        this.drawMyLocation(lon, lat);

        /* Solo centramos si se pidió explícitamente */
        if (centerOnUser) {
          this.map
            .getView()
            .animate({ center: fromLonLat([lon, lat]), zoom: 14, duration: 1000 });
        }
      },
      err => console.error('Error obteniendo ubicación inicial:', err),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  private drawMyLocation(lon: number, lat: number) {
    if (this.currentLocationOverlay) {
      this.currentLocationOverlay.setPosition(fromLonLat([lon, lat]));
      return;
    }

    const el = document.createElement('div');
    el.className = 'current-location-marker';

    const img = document.createElement('img');
    img.src = this.myLocationIconUrl;
    img.style.width = '30px';
    img.style.height = '30px';
    el.appendChild(img);

    this.currentLocationOverlay = new Overlay({
      element: el,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
      stopEvent: false
    });

    this.map.addOverlay(this.currentLocationOverlay);
  }

  /* ─────────────────────────── Marcadores ───────── */

  private async loadMarkers() {
    const evs = await this.eventApi.getFilteredEvents(this.eventFilters);
    this.markers.forEach(m => m.destroy());
    this.markers = [];

    evs.forEach(e => this.addMarker(e));
  }

  private addMarker(eventData: any) {
    const { id, longitude: lon, latitude: lat, title, privacy, image_url } =
      eventData;

    const factory = this.cfr.resolveComponentFactory(EventMarkerComponent);
    const compRef = factory.create(this.injector);

    compRef.instance.title = title;
    compRef.instance.coordinates = { lon, lat };
    compRef.instance.privacy = privacy;
    compRef.instance.image_url = image_url;
    compRef.changeDetectorRef.detectChanges();
    this.appRef.attachView(compRef.hostView);

    const el = document.createElement('div');
    el.className = 'event-marker-container';
    el.appendChild(compRef.location.nativeElement);

    this.map.addOverlay(
      new Overlay({
        element: el,
        position: fromLonLat([lon, lat]),
        positioning: 'bottom-center',
        stopEvent: true
      })
    );
    this.markers.push(compRef);

    compRef.instance.clicked.subscribe(() => {
      this.comm.notifyEventSelected({ id, latitude: lat, longitude: lon });
    });
  }


  private async centerAndOpenEvent(
    id: string,
    latitude: number,
    longitude: number
  ) {
    this.map
      .getView()
      .animate({ center: fromLonLat([longitude, latitude]), zoom: 14, duration: 1000 });

    try {
      const full = await this.eventApi.getEventById(id);
      this.selectedEvent = { id, ...full };
    } catch {
      console.warn('Evento no encontrado:', id);
    }
  }
}
