import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-marker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-marker.component.html',
  styleUrls: ['./event-marker.component.css']
})
export class EventMarkerComponent {
  @Input() title: string = '';
  @Input() coordinates: { lon: number; lat: number } = { lon: 0, lat: 0 };
  @Input() privacy : string = '';
  @Input() image_url: string = '';
  @Output() clicked = new EventEmitter<{
    lon: number; lat: number; title: string; privacy: string; image_url: string
  }>();

  onMarkerClick(): void {
    this.clicked.emit({
      lon: this.coordinates.lon,
      lat: this.coordinates.lat,
      title: this.title,
      privacy: this.privacy,
      image_url: this.image_url
    });
  }
}
