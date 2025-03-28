import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import {CommunicationService} from '../../services/CommunicationService';


@Component({
  selector: 'app-create-event-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {
  isOpen = true;
  showForm = false;

  // Propiedades de formulario
  titulo = '';
  deporte = '';
  descripcion = '';
  fecha = '';
  hora = '';
  maxParticipantes = '';
  privacidad = '';

  // Listas para los select
  deportes: string[] = ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Running'];
  privacidades: string[] = ['Privado', 'Público', 'Mejores amigos'];

  constructor(private eventApi: EventService, private communicationService: CommunicationService) { }

  ngOnInit() {
    this.communicationService.mapClick$.subscribe(data => {
      this.showForm = true;
    });
  }

  closeForm(): void {
    this.isOpen = false;
  }

  createEvent(): void {
    const nuevoEvento = {
      titulo: this.titulo,
      deporte: this.deporte,
      descripcion: this.descripcion,
      fecha: this.fecha,
      hora: this.hora,
      maxParticipantes: this.maxParticipantes,
      privacidad: this.privacidad
    };

    this.eventApi.createEvent(nuevoEvento);

    console.log('Evento creado:', nuevoEvento);
    this.closeForm();
  }


}
