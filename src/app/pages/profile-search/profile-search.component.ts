// src/app/pages/profile-search/profile-search.component.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { CommonModule, NgForOf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EventCardComponent } from '../../components/event-card/event-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { DietCardComponent } from '../../components/diet-card/diet-card.component';

import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { DietService } from '../../services/diet.service';
import { GeocodingService } from '../../services/geocoding.service';
import { CommunicationService } from '../../services/CommunicationService';

import { Diet } from '../../models/diet';
import { Subscription } from 'rxjs';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-profile-search',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgStyle,
    EventCardComponent,
    SearchBarComponent,
    DietCardComponent,
    TranslatePipe
  ],
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit, AfterViewInit {
  profileUid!: string;
  currentUserId: string | null = null;

  username = '';
  description = '';
  image_url = '';

  followers: string[] = [];
  followsCount = 0;
  isFollowing = false;

  eventsOrganizing: any[] = [];
  eventsAttending: any[] = [];
  placesOrganizing: string[] = [];
  placesAttending: string[] = [];

  diets: Diet[] = [];              // ← aquí guardaremos las dietas del perfil buscado

  @ViewChildren('cardFlex') cardFlexContainers!: QueryList<ElementRef>;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  selectedView: 'events' | 'diet' = 'events';

  private dietSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private eventService: EventService,
    private dietService: DietService,
    private geocodingService: GeocodingService,
    private comm: CommunicationService,
    private langService: LanguageService
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();

    this.route.paramMap.subscribe(async params => {
      const uid = params.get('profileUid');
      if (!uid) return;
      this.profileUid = uid;

      // Datos de perfil
      const data = await this.userService.getUserData(uid);
      if (!data) return;

      this.username     = data['username']    || '';
      this.description  = data['description'] || '';
      this.image_url    = data['image_url']   || '';
      this.followers    = data['followers']   || [];
      this.followsCount = (data['follows']    || []).length;

      this.isFollowing =
        this.currentUserId != null && this.followers.includes(this.currentUserId);

      // Eventos
      const [org, att] = await Promise.all([
        this.eventService.getEventsFromPaths(data['events_organizing'] || []),
        this.eventService.getEventsFromPaths(data['events_attending']  || [])
      ]);
      this.eventsOrganizing = org;
      this.eventsAttending  = att;
      this.fetchPlaces(org, this.placesOrganizing);
      this.fetchPlaces(att, this.placesAttending);

      // ←←← A partir de aquí cambia: suscríbete a las dietas de ESTE usuario
      if (this.dietSub) this.dietSub.unsubscribe();
      this.dietSub = this.dietService
        .getUserDietsByUid$(uid)
        .subscribe(diets => this.diets = diets);
    });

    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  private fetchPlaces(events: any[], target: string[]) {
    events.forEach((e, i) => {
      if (e.latitude != null && e.longitude != null) {
        this.geocodingService
          .getPlaceFromCoords(e.latitude, e.longitude)
          .subscribe({
            next: res => (target[i] = res.display_name || 'Ubicación desconocida'),
            error:  () => (target[i] = 'Ubicación no disponible')
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

  async onFollow() {
    if (!this.currentUserId || this.currentUserId === this.profileUid) return;
    if (this.isFollowing) {
      await this.userService.unfollowUser(this.profileUid);
      this.followers = this.followers.filter(id => id !== this.currentUserId!);
      this.isFollowing = false;
    } else {
      await this.userService.followUser(this.profileUid);
      this.followers = [...this.followers, this.currentUserId!];
      this.isFollowing = true;
    }
  }

  onEventSelected(ev: { id: string; latitude: number; longitude: number }) {
    this.comm.notifyEventSelected(ev);
    this.router.navigate(['/home']);
  }

  onMapPinClick() {
    this.selectedView = 'events';
  }
  onDietClick() {
    this.selectedView = 'diet';
  }
  onPhotoClick() {
    // por ahora sin funcionalidad
  }

  ngOnDestroy() {
    if (this.dietSub) this.dietSub.unsubscribe();
  }
}
