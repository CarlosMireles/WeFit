import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../services/CommunicationService';
import { CreateEventAlertComponent } from '../create-event-alert/create-event-alert.component';

@Component({
  selector: 'app-event-toggle',
  standalone: true,
  imports: [CommonModule, CreateEventAlertComponent],
  templateUrl: './event-toggle.component.html',
  styleUrls: ['./event-toggle.component.css']
})
export class EventToggleComponent {
  isActive = false;  // Estado del modo de creación
  showAlert = false; // Controla la visualización de la alerta

  constructor(private communicationService: CommunicationService) {
    this.isActive = this.communicationService.getEventCreationMode();
  }

  toggle(): void {
    if (!this.isActive) {
      // Al activar el modo de creación, mostramos la alerta
      this.isActive = true;
      this.showAlert = true;
      this.communicationService.setEventCreationMode(true);
    } else {
      // Si ya está activo, desactivamos todo
      this.isActive = false;
      this.showAlert = false;
      this.communicationService.setEventCreationMode(false);
    }
  }

  closeAlert(): void {
    // Al aceptar la alerta, solo se cierra la alerta, sin modificar el modo de creación
    this.showAlert = false;
  }
}
