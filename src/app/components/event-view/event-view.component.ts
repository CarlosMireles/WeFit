import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent {
  @Input() eventData: any;
  @Output() close = new EventEmitter<void>();

  hasJoined = false;
  canJoin = false;
  currentUserId: string | null = null;
  isOwner = false;

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
    console.log('Editar evento:', this.eventData.id);
    // Aquí puedes abrir otro modal o navegar a una ruta con router.navigate
    // this.router.navigate(['/editar-evento', this.eventData.id]);
  }

  onClose(): void {
    this.close.emit();
  }
}
