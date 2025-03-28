import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: Map;
  receptiveMode = false;

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.initMap();
    this.setCurrentLocation();
    // Suscribirse a los cambios del modo receptivo
    this.communicationService.receptiveMode$.subscribe(mode => {
      this.receptiveMode = mode;
    });
    // Añadir el listener para detectar clicks en el mapa
    this.map.on('click', (evt) => {
      console.log("Hola jefe");
      if (this.receptiveMode) {
        // Obtiene las coordenadas del click en la proyección del mapa
        const coordinates = evt.coordinate;
        // Notifica el click (puedes incluir más datos si lo requieres)
        this.communicationService.notifyMapClick({ coordinate: coordinates });
        // Desactiva el modo receptivo tras procesar el click
        this.communicationService.setReceptiveMode(false);
      }
    });
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
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // Centra y ajusta el zoom del mapa a la ubicación actual
          this.map.getView().setCenter(fromLonLat([longitude, latitude]));
          this.map.getView().setZoom(14);
          // Añade un marcador en la ubicación actual
          this.addMarker(longitude, latitude);
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
          src: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        })
      })
    );

    const vectorSource = new VectorSource({
      features: [marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    this.map.addLayer(vectorLayer);
  }

  handleMapClick() {
    if (this.receptiveMode) {
      const clickData = { /* coordenadas, etc. */ };
      this.communicationService.notifyMapClick(clickData);
      this.communicationService.setReceptiveMode(false);
    }
  }
}
