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

  hasJoined = false;
  canJoin = false;
  currentUserId: string | null = null;
  isOwner = false;
  participantNames: string[] = [];

  constructor(
    private eventService: EventService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();
    if (this.currentUserId) {
      this.isOwner = this.eventData.organizerId === this.currentUserId;
      this.hasJoined = this.eventData.participants.includes(this.currentUserId);
      this.canJoin =
        !this.isOwner &&
        !this.hasJoined &&
        this.eventData.participants.length < this.eventData.maxParticipants;
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
    await this.eventService.joinEvent(this.eventData.id, this.currentUserId);
    this.eventData.participants.push(this.currentUserId);
    this.hasJoined = true;
    this.canJoin = false;
    await this.loadParticipantNames();
  }

  async leaveEvent() {
    if (!this.hasJoined || !this.currentUserId) return;
    await this.eventService.leaveEvent(this.eventData.id, this.currentUserId);
    this.eventData.participants = this.eventData.participants.filter(
      id => id !== this.currentUserId
    );
    this.hasJoined = false;
    this.canJoin =
      !this.isOwner &&
      this.eventData.participants.length < this.eventData.maxParticipants;
    await this.loadParticipantNames();
  }

  editEvent() {
  }

  onClose(): void {
    this.close.emit();
  }
}
