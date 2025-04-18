import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgStyle } from '@angular/common';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgStyle,
    EventCardComponent,
    SearchBarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  username: string = '';
  description: string = '';
  image_url: string = '';
  follows: any[] = [];
  followers: any[] = [];
  eventsOrganizing: any[] = [];
  eventsAttending: any[] = [];

  placesOrganizing: string[] = [];
  placesAttending: string[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private geocodingService: GeocodingService
  ) {}

  async ngOnInit() {
    // Cargar datos cacheados si existen
    const cachedUsername = localStorage.getItem('username');
    const cachedDescription = localStorage.getItem('description');
    const cachedImageUrl = localStorage.getItem('image_url');
    const cachedOrganizing = localStorage.getItem('eventsOrganizing');
    const cachedAttending = localStorage.getItem('eventsAttending');

    if (cachedUsername) this.username = cachedUsername;
    if (cachedDescription) this.description = cachedDescription;
    if (cachedImageUrl) this.image_url = cachedImageUrl;
    if (cachedOrganizing) this.eventsOrganizing = JSON.parse(cachedOrganizing);
    if (cachedAttending) this.eventsAttending = JSON.parse(cachedAttending);

    // Obtener usuario actual
    const uid = await this.userService.getCurrentUserUid();
    if (!uid) return;

    // Traer datos del usuario
    const userData = await this.userService.getUserData(uid);
    if (!userData) return;

    // Asignar datos y actualizar cache
    this.username = userData.username;
    this.description = userData.description as string || '';
    this.image_url = userData.image_url || '';

    localStorage.setItem('username', this.username);
    localStorage.setItem('description', this.description);
    localStorage.setItem('image_url', this.image_url);

    // Cargar eventos
    const [organizing, attending] = await Promise.all([
      this.eventService.getEventsFromPaths(userData.events_organizing),
      this.eventService.getEventsFromPaths(userData.events_attending)
    ]);
    this.eventsOrganizing = organizing;
    this.eventsAttending = attending;

    localStorage.setItem('eventsOrganizing', JSON.stringify(this.eventsOrganizing));
    localStorage.setItem('eventsAttending', JSON.stringify(this.eventsAttending));

    // Obtener lugares
    this.fetchPlaces(this.eventsOrganizing, this.placesOrganizing);
    this.fetchPlaces(this.eventsAttending, this.placesAttending);
  }

  fetchPlaces(events: any[], targetList: string[]) {
    events.forEach((event, index) => {
      if (event.latitude != null && event.longitude != null) {
        this.geocodingService.getPlaceFromCoords(event.latitude, event.longitude)
          .subscribe({
            next: res => targetList[index] = res.display_name || 'Ubicación desconocida',
            error: () => targetList[index] = 'Ubicación no disponible'
          });
      } else {
        targetList[index] = 'Sin coordenadas';
      }
    });
  }

  ngAfterViewInit() {
    const cardContainers = document.querySelectorAll('.card-flex');
    cardContainers.forEach(container => {
      container.addEventListener('mousedown', (e: any) => {
        this.isDragging = true;
        container.classList.add('active');
        this.startX = e.pageX - (container as HTMLElement).offsetLeft;
        this.scrollLeft = container.scrollLeft;
      });
      container.addEventListener('mousemove', (e: any) => {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - (container as HTMLElement).offsetLeft;
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
}
