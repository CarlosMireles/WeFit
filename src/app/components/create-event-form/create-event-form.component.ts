import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CommunicationService } from '../../services/CommunicationService';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

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
    "event-form.Athletics",
    "event-form.MartialArts",
    "event-form.Badminton",
    "event-form.Basketball",
    "event-form.Handball",
    "event-form.Baseball",
    "event-form.Boxing",
    "event-form.Cricket",
    "event-form.Cycling",
    "event-form.SportClimbing",
    "event-form.Fencing",
    "event-form.Skiing",
    "event-form.Football",
    "event-form.AmericanFootball",
    "event-form.Futsal",
    "event-form.Golf",
    "event-form.Gymnastics",
    "event-form.FieldHockey",
    "event-form.IceHockey",
    "event-form.Wrestling",
    "event-form.Swimming",
    "event-form.Padel",
    "event-form.Rowing",
    "event-form.Rugby",
    "event-form.Skateboarding",
    "event-form.Snowboarding",
    "event-form.Surfing",
    "event-form.Tennis",
    "event-form.Volleyball",
    "event-form.HorseRiding"
  ];

  privacies: string[] = ['event-form.private', 'event-form.public', 'event-form.close-friends'];

  constructor(private eventApi: EventService, private communicationService: CommunicationService, private langService: LanguageService) {}

  ngOnInit() {
    this.communicationService.mapClick$.subscribe(data => {
      this.latitude = data.lat;
      this.longitude = data.lon;
      this.isOpen = true; // Abre el formulario cuando se haga clic en el mapa
      this.resetForm(); // Resetea el formulario
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
