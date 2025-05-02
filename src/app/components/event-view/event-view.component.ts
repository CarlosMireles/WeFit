import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DeleteUserAlertComponent } from '../delete-user-alert/delete-user-alert.component';
import { CommunicationService } from '../../services/CommunicationService';
import { ReportService } from '../../services/report.service';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../services/translate.service';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ConfirmDialogComponent,
    DeleteUserAlertComponent,
    TranslatePipe
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

  participantNames: string[] = [];
  participantList: Array<{ id: string; name: string }> = [];

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
    "Atletismo","Artes marciales","Bádminton","Baloncesto","Balonmano","Béisbol",
    "Boxeo","Críquet","Ciclismo","Equitación","Escalada deportiva","Esgrima",
    "Esquí","Fútbol","Fútbol americano","Fútbol sala","Golf","Gimnasia",
    "Hockey sobre césped","Hockey sobre hielo","Lucha libre","Natación","Padel",
    "Remo","Rugby","Skateboarding","Snowboard","Surf","Tenis","Voleibol"
  ];

  // URL para abrir Gmail compose
  gmailComposeUrl: string = '';

  constructor(
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private communicationService: CommunicationService,
    private reportService: ReportService,
    private langService: LanguageService
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();

    if (this.currentUserId) {
      const lang = this.langService.currentLang;
      await this.langService.changeLang(lang);
      this.isOwner = this.eventData.organizerId === this.currentUserId;
      this.hasJoined = this.eventData.participants.includes(this.currentUserId);
      const hasCapacity = this.eventData.participants.length < this.eventData.maxParticipants;
      this.canJoin = !this.isOwner && !this.hasJoined && hasCapacity;
    }

    await this.loadParticipantNames();
    await this.loadParticipantList();

    if (!this.isOwner) {
      const creatorData = await this.userService.getUserById(this.eventData.organizerId);
      const creatorUsername = creatorData['username'] || creatorData['displayName'] || '';
      this.gmailComposeUrl = await this.reportService.getGmailComposeUrl(
        creatorUsername,
        this.eventData.title
      );
    }
  }

  private async loadParticipantNames() {
    const ids = this.eventData.participants || [];
    this.participantNames = await Promise.all(
      ids.map(async id => {
        try {
          const data = await this.userService.getUserById(id);
          return data['displayName'] || data['username'] || 'Usuario desconocido';
        } catch {
          return 'Usuario desconocido';
        }
      })
    );
  }

  private async loadParticipantList() {
    const ids = this.eventData.participants || [];
    this.participantList = await Promise.all(
      ids.map(async id => {
        try {
          const data = await this.userService.getUserById(id);
          return { id, name: data['displayName'] || data['username'] || 'Usuario desconocido' };
        } catch {
          return { id, name: 'Usuario desconocido' };
        }
      })
    );
  }

  goToProfile(userId: string) {
    if (userId === this.currentUserId) {
      this.router.navigate(['/userProfile']);
    } else {
      this.router.navigate(['/profile-search', userId]);
    }
    this.close.emit();
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
    } catch (error) {
      console.error('Error al unirse al evento:', error);
    }
  }

  async leaveEvent() {
    if (!this.hasJoined || !this.currentUserId) return;
    try {
      await this.eventService.leaveEvent(this.eventData.id, this.currentUserId);
      this.eventData.participants = this.eventData.participants.filter(id => id !== this.currentUserId);
      this.hasJoined = false;
      this.canJoin = !this.isOwner && this.eventData.participants.length < this.eventData.maxParticipants;
      await this.loadParticipantNames();
      await this.loadParticipantList();
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
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  }

  askDeleteParticipant(p: { id: string; name: string }) {
    this.participantToDelete = p;
    this.showDeleteAlert = true;
  }

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

  onReport() {
    window.open(this.gmailComposeUrl, '_blank');
  }

}
