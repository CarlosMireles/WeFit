import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { GeocodingService } from '../../services/geocoding.service';
import { CommunicationService } from '../../services/CommunicationService';
import { DeleteEventAlertComponent } from '../../components/delete-event-alert/delete-event-alert.component';
import { LeaveEventAlertComponent } from '../../components/leave-event-alert/leave-event-alert.component';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../services/translate.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    EventCardComponent,
    SearchBarComponent,
    TranslatePipe,
    DeleteEventAlertComponent,
    LeaveEventAlertComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  username = '';
  description = '';
  image_url = '';
  followers: string[] = [];
  follows: string[] = [];
  eventsOrganizing: any[] = [];
  eventsAttending: any[] = [];
  placesOrganizing: string[] = [];
  placesAttending: string[] = [];

  currentUserId: string | null = null;

  @ViewChildren('cardFlex') cardFlexContainers!: QueryList<ElementRef>;

  // **Estados de alerta**
  showDeleteEventAlert = false;
  eventToDelete: any | null = null;

  showLeaveEventAlert = false;
  eventToLeave: any | null = null;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private geocodingService: GeocodingService,
    private comm: CommunicationService,
    private router: Router,
    private langService: LanguageService
  ) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
    const uid = await this.userService.getCurrentUserUid();
    if (!uid) return;
    this.currentUserId = uid;

    const data = await this.userService.getUserData(uid);
    if (!data) return;

    this.username    = data['username']    || '';
    this.description = data['description'] || '';
    this.image_url   = data['image_url']   || '';
    this.followers   = data['followers']   || [];
    this.follows     = data['follows']     || [];

    const [org, att] = await Promise.all([
      this.eventService.getEventsFromPaths(data['events_organizing'] || []),
      this.eventService.getEventsFromPaths(data['events_attending']  || [])
    ]);
    this.eventsOrganizing = org;
    this.eventsAttending  = att;

    this.fetchPlaces(org, this.placesOrganizing);
    this.fetchPlaces(att, this.placesAttending);
  }

  private fetchPlaces(events: any[], target: string[]) {
    events.forEach((e, i) => {
      if (e.latitude != null && e.longitude != null) {
        this.geocodingService.getPlaceFromCoords(e.latitude, e.longitude)
          .subscribe({
            next: res => target[i] = res.display_name || 'Ubicación desconocida',
            error: () => target[i] = 'Ubicación no disponible'
          });
      } else {
        target[i] = 'Sin coordenadas';
      }
    });
  }

  ngAfterViewInit() {
    this.cardFlexContainers.forEach(containerRef => {
      const container = containerRef.nativeElement as HTMLElement;
      container.addEventListener('mousedown', (e: MouseEvent) => {
        this.isDragging = true;
        container.classList.add('active');
        this.startX = e.pageX - container.offsetLeft;
        this.scrollLeft = container.scrollLeft;
      });
      container.addEventListener('mousemove', (e: MouseEvent) => {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        container.scrollLeft = this.scrollLeft - (x - this.startX);
      });

      container.addEventListener('mouseup', () => {
        this.isDragging = false;
        container.classList.remove('active');
      });

      container.addEventListener('mouseleave', () => {
        this.isDragging = false;
        container.classList.remove('active');
      });
    });
  }

  onSettings() {
    this.router.navigate(['/configuration']);
  }

  onEventSelected(ev: { id: string; latitude: number; longitude: number }) {
    this.comm.notifyEventSelected(ev);
    this.router.navigate(['/home']);
  }

  /** Abre alerta de BORRAR evento */
  askDeleteEvent(e: any) {
    this.eventToDelete = e;
    this.showDeleteEventAlert = true;
  }
  /** Confirma BORRAR evento */
  async onDeleteEventConfirm() {
    if (!this.eventToDelete) return;
    await this.eventService.deleteEvent(this.eventToDelete.id);
    // Elimina de arrays
    const i = this.eventsOrganizing.findIndex(x => x.id === this.eventToDelete.id);
    if (i > -1) {
      this.eventsOrganizing.splice(i,1);
      this.placesOrganizing.splice(i,1);
    }
    this.showDeleteEventAlert = false;
    this.eventToDelete = null;
  }
  onDeleteEventCancel() {
    this.showDeleteEventAlert = false;
    this.eventToDelete = null;
  }

  /** Abre alerta de ABANDONAR evento */
  askLeaveEvent(e: any) {
    this.eventToLeave = e;
    this.showLeaveEventAlert = true;
  }
  /** Confirma ABANDONAR evento */
  async onLeaveEventConfirm() {
    if (!this.eventToLeave || !this.currentUserId) return;
    await this.eventService.leaveEvent(this.eventToLeave.id, this.currentUserId);
    const i = this.eventsAttending.findIndex(x => x.id === this.eventToLeave.id);
    if (i > -1) {
      this.eventsAttending.splice(i,1);
      this.placesAttending.splice(i,1);
    }
    this.showLeaveEventAlert = false;
    this.eventToLeave = null;
  }
  onLeaveEventCancel() {
    this.showLeaveEventAlert = false;
    this.eventToLeave = null;
  }
}
