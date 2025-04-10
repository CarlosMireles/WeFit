import { Component, AfterViewInit } from '@angular/core';
import {EventCardComponent} from '../../components/event-card/event-card.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    EventCardComponent,
    SearchBarComponent,
    NgForOf
  ],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements AfterViewInit {
  private isDragging = false;
  private startX: number = 0;
  private scrollLeft: number = 0;
  username: string = '';
  eventsOrganizing: any[] = [];
  eventsAttending: any[] = [];



  constructor(private userService: UserService, private eventService: EventService) {}


  async ngOnInit() {
    const uid = this.userService.getCurrentUserUid();
    if (!uid) return;

    const userData = await this.userService.getUserData(uid);
    if (userData) {
      this.username = userData.username;
      const organizing = await this.eventService.getEventsFromPaths(userData.events_organizing);
      const attending = await this.eventService.getEventsFromPaths(userData.events_attending);
      this.eventsOrganizing = organizing;
      console.log(organizing);
      this.eventsAttending = attending;

    }
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
        const distance = x - this.startX;
        container.scrollLeft = this.scrollLeft - distance;
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
