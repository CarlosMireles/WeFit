import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-event-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-toggle.component.html',
  styleUrls: ['./event-toggle.component.css']
})
export class EventToggleComponent {
  isActive = false;

  constructor(private communicationService: CommunicationService) {
    // Suscribirse al estado actual del modo receptivo
      this.isActive = this.communicationService.getReceptiveMode();
  }

  toggle(): void {
    this.isActive = !this.isActive; // Cambia el estado del botón
    this.communicationService.setReceptiveMode(this.isActive); // Activa o desactiva el modo receptivo
  }
}
