import { Component, OnInit, OnDestroy } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { CommunicationService } from '../../services/CommunicationService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: Map;
  receptiveMode = false;
  vectorSource = new VectorSource(); // Fuente para los marcadores
  private subscriptions: Subscription[] = [];

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.initMap();
    this.setCurrentLocation();

    // Suscribirse al modo receptivo
    this.subscriptions.push(
      this.communicationService.receptiveMode$.subscribe(mode => {
        this.receptiveMode = mode;
        console.log('Modo receptivo cambiado a:', mode);
      })
    );

    // Escuchar eventos de "click en mapa"
    this.map.on('click', (evt) => {
      if (this.receptiveMode) {
        const coordinates = toLonLat(evt.coordinate); // Convertir a lat/lon reales
        console.log('Clic en mapa detectado en modo receptivo:', coordinates);
        this.communicationService.notifyMapClick({ lat: coordinates[1], lon: coordinates[0] });
        // Ya no desactivamos el modo receptivo aquí
        // this.communicationService.setReceptiveMode(false);
      }
    });

    // Escuchar cuando se cree un evento para agregar marcador
    this.subscriptions.push(
      this.communicationService.eventCreated$.subscribe(evento => {
        console.log('Evento creado, agregando marcador:', evento);
        this.addMarker(evento.lon, evento.lat);
      })
    );
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

    // Agregar capa de marcadores
    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.map.addLayer(vectorLayer);
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.map.getView().setCenter(fromLonLat([lon, lat]));
          this.map.getView().setZoom(14);
          this.addMarker(lon, lat);
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada en este navegador.');
    }
  }

  private addMarker(lon: number, lat: number): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat]))
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' // Icono rojo para eventos
        })
      })
    );

    this.vectorSource.addFeature(marker); // Agregar a la fuente
  }
}
