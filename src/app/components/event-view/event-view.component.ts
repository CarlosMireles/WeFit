import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {CommunicationService} from '../../services/CommunicationService';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  @Input() eventData!: {
    id: string;
    title: string;
    description: string;
    sport: string;
    day: string;
    hour: string;
    maxParticipants: number;
    privacy: string;
    organizerId: string;
    participants: string[];
  };
  @Output() close = new EventEmitter<void>();

  currentUserId: string | null = null;
  hasJoined = false;
  canJoin = false;
  isOwner = false;
  isEditing = false;
  showConfirmDialog = false;
  participantNames: string[] = [];

  editData = {
    title: '',
    description: '',
    sport: '',
    day: '',
    hour: '',
    maxParticipants: 0,
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

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private communicationService: CommunicationService
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();

    if (this.currentUserId) {
      this.isOwner = this.eventData.organizerId === this.currentUserId;
      this.hasJoined = this.eventData.participants.includes(this.currentUserId);
      const hasCapacity = this.eventData.participants.length < this.eventData.maxParticipants;
      this.canJoin = !this.isOwner && !this.hasJoined && hasCapacity;
    }

    await this.loadParticipantNames();
  }

  private async loadParticipantNames() {
    const ids = this.eventData.participants || [];
    this.participantNames = await Promise.all(
      ids.map(async id => {
        try {
          const user = await this.userService.getUserById(id);
          return user['displayName'] || user['username'] || 'Usuario desconocido';
        } catch {
          return 'Usuario desconocido';
        }
      })
    );
  }

  async joinEvent() {
    if (!this.canJoin || !this.currentUserId) return;

    try {
      await this.eventService.joinEvent(this.eventData.id, this.currentUserId);
      this.eventData.participants.push(this.currentUserId);
      this.hasJoined = true;
      this.canJoin = false;
      await this.loadParticipantNames();
      console.log('Usuario inscrito con éxito.');
    } catch (error) {
      console.error('Error al unirse al evento:', error);
    }
  }

  async leaveEvent() {
    if (!this.hasJoined || !this.currentUserId) return;

    try {
      await this.eventService.leaveEvent(this.eventData.id, this.currentUserId);
      this.eventData.participants = this.eventData.participants.filter(
        id => id !== this.currentUserId
      );
      this.hasJoined = false;
      this.canJoin = !this.isOwner &&
        this.eventData.participants.length < this.eventData.maxParticipants;
      await this.loadParticipantNames();
      console.log('Usuario desinscrito con éxito.');
    } catch (error) {
      console.error('Error al desinscribirse del evento:', error);
    }
  }

  editEvent() {
    this.editData = {
      title: this.eventData.title,
      description: this.eventData.description,
      sport: this.eventData.sport,
      day: this.eventData.day,
      hour: this.eventData.hour,
      maxParticipants: this.eventData.maxParticipants,
      privacy: this.eventData.privacy
    };
    this.isEditing = true;
  }

  async saveEvent() {
    try {
      await this.eventService.updateEvent(this.eventData.id, this.editData);
      this.eventData = { ...this.eventData, ...this.editData };
      this.isEditing = false;
      console.log('Evento actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  async onConfirmSave() {
    this.showConfirmDialog = false;
    try {
      await this.eventService.updateEvent(this.eventData.id, this.editData);
      this.eventData = { ...this.eventData, ...this.editData };
      this.isEditing = false;
      this.communicationService.notifyEventModified(true);
      console.log('Evento actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
