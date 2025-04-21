import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  @Input() eventData: any;
  @Output() close = new EventEmitter<void>();

  hasJoined = false;
  canJoin = false;
  currentUserId: string | null = null;
  isOwner = false;
  isEditing = false;
  showConfirmDialog = false;

  // Datos editables
  editData = {
    title: '',
    description: '',
    sport: '',
    day: '',
    hour: '',
    maxParticipants: 0,
    privacy: ''
  };

  constructor(
    private eventService: EventService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();

    if (this.currentUserId) {
      this.isOwner = this.eventData.organizerId === this.currentUserId;
      this.hasJoined = this.eventData.participants.includes(this.currentUserId);
      const hasCapacity = this.eventData.participants.length < this.eventData.maxParticipants;

      this.canJoin = !this.isOwner && !this.hasJoined && hasCapacity;
    }
  }

  async joinEvent() {
    if (!this.canJoin || !this.currentUserId) return;

    try {
      await this.eventService.joinEvent(this.eventData.id, this.currentUserId);
      this.eventData.participants.push(this.currentUserId);
      this.hasJoined = true;
      this.canJoin = false;
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
        (id: string) => id !== this.currentUserId
      );
      this.hasJoined = false;
      this.canJoin = !this.isOwner && this.eventData.participants.length < this.eventData.maxParticipants;
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

  onClose(): void {
    this.close.emit();
  }

  async onConfirmSave() {
    this.showConfirmDialog = false;
    try {
      await this.eventService.updateEvent(this.eventData.id, this.editData);
      this.eventData = { ...this.eventData, ...this.editData };
      this.isEditing = false;
      console.log('Evento actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  }

}
