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

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    EventCardComponent,
    SearchBarComponent
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

  @ViewChildren('cardFlex') cardFlexContainers!: QueryList<ElementRef>;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private geocodingService: GeocodingService,
    private comm: CommunicationService,
    private router: Router
  ) {}

  async ngOnInit() {
    const uid = await this.userService.getCurrentUserUid();
    if (!uid) return;

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
    // Configura lógica de arrastre para cada contenedor .card-flex
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
    this.router.navigate(['/user-settings']);
  }

  onEventSelected(ev: { id: string; latitude: number; longitude: number }) {
    this.comm.notifyEventSelected(ev);
    this.router.navigate(['/home']);
  }
}
