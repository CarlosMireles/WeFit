import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventFilters } from '../../services/event.service';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-filter-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent {
  @Output() close = new EventEmitter<void>();

  filters: EventFilters = {
    date: '',
    hour: '',
    sport: '',
    maxParticipants: undefined,
    privacy: ''
  };

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

  constructor(private communicationService: CommunicationService) {}

  applyFilters() {
    // Si filters.hour o filters.date son undefined, se asigna '' para evitar el error
    this.filters.hour = (this.filters.hour || '').replace('.', ':').trim();
    this.filters.date = (this.filters.date || '').trim();

    console.log('Aplicando filtros normalizados:', this.filters);
    this.communicationService.notifyFiltersApplied(this.filters);
    this.close.emit();
  }


  cancel() {
    this.close.emit();
  }
}
