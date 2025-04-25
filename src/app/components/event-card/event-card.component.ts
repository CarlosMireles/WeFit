import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() place!: string;
  @Input() date!: string;
  @Input() hour!: string;
  @Input() participants!: number;
  @Input() maxParticipants!: number;
  @Input() latitude!: number;
  @Input() longitude!: number;

  @Output() selected = new EventEmitter<{
    id: string;
    latitude: number;
    longitude: number;
  }>();

  constructor(private router: Router) {}

  onCardClick() {
    // 1) Emitimos la selección para que el mapa lo recoja
    this.selected.emit({
      id: this.id,
      latitude: this.latitude,
      longitude: this.longitude
    });

    // 2) Navegamos al mapa donde el MapComponent está suscrito a eventSelected$
    this.router.navigate(['/home']);
  }
}
