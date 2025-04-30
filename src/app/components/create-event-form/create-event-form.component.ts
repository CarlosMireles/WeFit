import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CommunicationService } from '../../services/CommunicationService';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-create-event-form',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, FormsModule, TranslatePipe], // Importa los módulos necesarios
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

  latitude: number | null = null;
  longitude: number | null = null;

  sports: string[] = [
    "Atletismo",
    "Artes marciales",
    "Bádminton",
    "Baloncesto",
    "Balonmano",
    "Béisbol",
    "Boxeo",
    "Críquet",
    "Ciclismo",
    "Equitación",
    "Escalada deportiva",
    "Esgrima",
    "Esquí",
    "Fútbol",
    "Fútbol americano",
    "Fútbol sala",
    "Golf",
    "Gimnasia",
    "Hockey sobre césped",
    "Hockey sobre hielo",
    "Lucha libre",
    "Natación",
    "Padel",
    "Remo",
    "Rugby",
    "Skateboarding",
    "Snowboard",
    "Surf",
    "Tenis",
    "Voleibol"
  ];

  privacies: string[] = ['Privado', 'Público', 'Mejores amigos'];

  constructor(private eventApi: EventService, private communicationService: CommunicationService,private langService: LanguageService, private userService: UserService) {}

  async ngOnInit() {
    this.communicationService.mapClick$.subscribe(async data => {
      this.latitude = data.lat;
      this.longitude = data.lon;
      this.isOpen = true;
      this.resetForm();
      this.organizerId = await this.userService.getCurrentUserUid();
    });
    this.initializeLanguage();
  }

  async initializeLanguage() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
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

  async createEvent(): Promise<void> {
    if (this.latitude === null || this.longitude === null) {
      console.error("No se puede crear el evento sin ubicación.");
      return;
    }

    if (!this.organizerId) {
      this.organizerId = await this.userService.getCurrentUserUid();
      if (!this.organizerId) {
        console.error("No se pudo obtener el ID del organizador.");
        return;
      }
    }

    const newEvent = {
      title: this.title,
      sport: this.sport,
      description: this.description,
      organizerId: this.organizerId,
      day: this.day,
      hour: this.hour,
      maxParticipants: this.maxParticipants,
      participants: [this.organizerId],
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
