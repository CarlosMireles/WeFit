import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  @Input() title: string;
  @Input() place: String;
  @Input() date: String;
  @Input() hour: String;
  @Input() participants: String;
  @Input() maxParticipants: String;


  constructor() {
    this.title = '';
    this.place = '';
    this.date = '';
    this.hour = '';
    this.participants = '';
    this.maxParticipants = '';
  }
}
