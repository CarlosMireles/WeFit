import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DeleteUserAlertComponent } from '../delete-user-alert/delete-user-alert.component';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmDialogComponent,
    DeleteUserAlertComponent
  ],
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

  // **Mantenemos la lista de nombres para otras partes de tu lógica**
  participantNames: string[] = [];

  // **Nueva lista con id y name para la papelera**
  participantList: Array<{ id: string; name: string }> = [];

  // **Control de la alerta de borrado**
  showDeleteAlert = false;
  participantToDelete: { id: string; name: string } | null = null;

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
    /* tu array de deportes */
    "Atletismo","Artes marciales","Bádminton","Baloncesto","Balonmano","Béisbol",
    "Boxeo","Críquet","Ciclismo","Equitación","Escalada deportiva","Esgrima",
    "Esquí","Fútbol","Fútbol americano","Fútbol sala","Golf","Gimnasia",
    "Hockey sobre césped","Hockey sobre hielo","Lucha libre","Natación","Padel",
    "Remo","Rugby","Skateboarding","Snowboard","Surf","Tenis","Voleibol"
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
    await this.loadParticipantList();
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

  /** Construye también una lista con {id,name} para la papelera */
  private async loadParticipantList() {
    const ids = this.eventData.participants || [];
    this.participantList = await Promise.all(
      ids.map(async id => {
        try {
          const user = await this.userService.getUserById(id);
          return {
            id,
            name: user['displayName'] || user['username'] || 'Usuario desconocido'
          };
        } catch {
          return { id, name: 'Usuario desconocido' };
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
      await this.loadParticipantList();
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
      await this.loadParticipantList();
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

  /** Abre la alerta de borrado */
  askDeleteParticipant(p: { id: string; name: string }) {
    this.participantToDelete = p;
    this.showDeleteAlert = true;
  }

  /** Borra al participante si confirman */
  async onAlertAccept() {
    if (!this.participantToDelete) return;
    const id = this.participantToDelete.id;
    try {
      await this.eventService.leaveEvent(this.eventData.id, id);
      this.eventData.participants = this.eventData.participants.filter(pid => pid !== id);
      await this.loadParticipantNames();
      await this.loadParticipantList();
      this.showDeleteAlert = false;
      this.participantToDelete = null;
    } catch (error) {
      console.error('Error al eliminar participante:', error);
    }
  }

  onAlertCancel() {
    this.showDeleteAlert = false;
    this.participantToDelete = null;
  }

  onClose(): void {
    this.close.emit();
  }
}
