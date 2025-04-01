import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../services/CommunicationService';

@Component({
  selector: 'app-event-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-toggle.component.html',
  styleUrls: ['./event-toggle.component.css']
})
export class EventToggleComponent {
  isActive = false;

  constructor(private communicationService: CommunicationService) {
      this.isActive = this.communicationService.getEventCreationMode();
  }

  toggle(): void {
    this.isActive = !this.isActive;
    this.communicationService.setEventCreationMode(this.isActive);
  }
}
