import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgForOf, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-profile-search',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgStyle,
    EventCardComponent,
    SearchBarComponent
  ],
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit, AfterViewInit {
  profileUid!: string;

  username: string = '';
  description: string = '';
  image_url: string = '';
  follows: string[] = [];
  followers: string[] = [];
  eventsOrganizing: any[] = [];
  eventsAttending: any[] = [];
  placesOrganizing: string[] = [];
  placesAttending: string[] = [];

  currentUserId: string | null = null;
  isFollowing: boolean = false;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const uid = params.get('profileUid');
      if (!uid) return;
      this.profileUid = uid;

      // UID actual
      this.currentUserId = await this.userService.getCurrentUserUid();

      // Carga datos exactos como en UserProfileComponent
      const data = await this.userService.getUserData(this.profileUid);
      if (!data) return;

      this.username    = data['username'];
      this.description = data['description'];
      this.image_url   = data['image_url'];
      this.follows     = data['follows'];
      this.followers   = data['followers'];

      // Estado del botón
      this.isFollowing = !!(
        this.currentUserId &&
        this.follows.includes(this.currentUserId)
      );

      // Eventos
      const [org, att] = await Promise.all([
        this.eventService.getEventsFromPaths(data['events_organizing']),
        this.eventService.getEventsFromPaths(data['events_attending'])
      ]);
      this.eventsOrganizing = org;
      this.eventsAttending  = att;

      this.fetchPlaces(this.eventsOrganizing, this.placesOrganizing);
      this.fetchPlaces(this.eventsAttending, this.placesAttending);
    });
  }

  private fetchPlaces(events: any[], target: string[]) {
    events.forEach((e, i) => {
      if (e.latitude != null && e.longitude != null) {
        this.geocodingService
          .getPlaceFromCoords(e.latitude, e.longitude)
          .subscribe({
            next: res => (target[i] = res.display_name || 'Ubicación desconocida'),
            error: () => (target[i] = 'Ubicación no disponible')
          });
      } else {
        target[i] = 'Sin coordenadas';
      }
    });
  }

  ngAfterViewInit() {
    document.querySelectorAll('.card-flex').forEach(container => {
      container.addEventListener('mousedown', (e: any) => {
        this.isDragging = true;
        container.classList.add('active');
        this.startX = e.pageX - (container as HTMLElement).offsetLeft;
        this.scrollLeft = (container as HTMLElement).scrollLeft;
      });
      container.addEventListener('mousemove', (e: any) => {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - (container as HTMLElement).offsetLeft;
        (container as HTMLElement).scrollLeft =
          this.scrollLeft - (x - this.startX);
      });
      ['mouseup', 'mouseleave'].forEach(evt =>
        container.addEventListener(evt, () => {
          this.isDragging = false;
          container.classList.remove('active');
        })
      );
    });
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }
}
