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
  isOpen = false; // Se abre cuando se hace clic en el mapa
  showForm = false;

  // Propiedades del formulario
  titulo!: string;
  deporte!: string;
  descripcion!: string;
  fecha!: string;
  hora!: string;
  maxParticipantes!: number;
  privacidad!: string;

  // Coordenadas del evento
  latitud: number | null = null;
  longitud: number | null = null;

  // Listas para los select
  deportes: string[] = ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Running'];
  privacidades: string[] = ['Privado', 'Público', 'Mejores amigos'];

  constructor(private eventApi: EventService, private communicationService: CommunicationService) {}

  ngOnInit() {
    this.communicationService.mapClick$.subscribe(data => {
      this.latitud = data.lat;
      this.longitud = data.lon;
      this.isOpen = true; // Abre el formulario cuando se haga clic en el mapa
      this.resetForm(); // Resetea el formulario
    });
  }

  closeForm(): void {
    this.isOpen = false;
    this.resetForm(); // Resetea el formulario al cerrar
  }

  resetForm(): void {
    this.titulo = '';
    this.deporte = '';
    this.descripcion = '';
    this.fecha = '';
    this.hora = '';
    this.maxParticipantes = 1; // Valor mínimo por defecto
    this.privacidad = '';
  }

  createEvent(): void {
    if (this.latitud === null || this.longitud === null) {
      console.error("No se puede crear el evento sin ubicación.");
      return;
    }

    const nuevoEvento = {
      titulo: this.titulo,
      deporte: this.deporte,
      descripcion: this.descripcion,
      fecha: this.fecha,
      hora: this.hora,
      maxParticipantes: this.maxParticipantes,
      privacidad: this.privacidad,
      latitud: this.latitud,
      longitud: this.longitud
    };

    this.eventApi.createEvent(nuevoEvento);
    console.log('Evento creado:', nuevoEvento);

    // Notifica que se ha creado un evento para que el mapa agregue una chincheta
    this.communicationService.notifyEventCreated({
      lat: this.latitud,
      lon: this.longitud,
      titulo: this.titulo
    });

    this.closeForm();
  }
}
