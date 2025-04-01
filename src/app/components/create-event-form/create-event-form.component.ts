import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-create-event-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {
  isOpen = false;

  // Propiedades del formulario
  title!: string;
  sport!: string;
  description!: string;
  day!: string;
  hour!: string;
  maxParticipants!: number;
  privacy!: string;

  // Coordenadas del evento
  latitude: number | null = null;
  longitude: number | null = null;

  // Listas para los select
  sports: string[] = ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Running'];
  privacies: string[] = ['Privado', 'Público', 'Mejores amigos'];

  constructor(private eventApi: EventService, private communicationService: CommunicationService) {}

  ngOnInit() {
    this.communicationService.mapClick$.subscribe(data => {
      this.latitude = data.lat;
      this.longitude = data.lon;
      this.isOpen = true; // Abre el formulario cuando se haga clic en el mapa
      this.resetForm(); // Resetea el formulario
    });
  }

  closeForm(): void {
    this.isOpen = false;
    this.resetForm(); // Resetea el formulario al cerrar
  }

  resetForm(): void {
    this.title = '';
    this.sport = '';
    this.description = '';
    this.day = '';
    this.hour = '';
    this.maxParticipants = 1; // Valor mínimo por defecto
    this.privacy = '';
  }

  createEvent(): void {
    if (this.latitude === null || this.longitude === null) {
      console.error("No se puede crear el evento sin ubicación.");
      return;
    }

    const newEvent = {
      title: this.title,
      sport: this.sport,
      description: this.description,
      day: this.day,
      hour: this.hour,
      maxParticipants: this.maxParticipants,
      privacy: this.privacy,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.eventApi.createEvent(newEvent);
    this.communicationService.notifyEventCreated(true);
    console.log('Evento creado:', newEvent);
    this.closeForm();
  }
}
