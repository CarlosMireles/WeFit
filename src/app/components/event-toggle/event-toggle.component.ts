import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommunicationService} from '../../services/CommunicationService';

@Component({
  selector: 'app-event-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-toggle.component.html',
  styleUrls: ['./event-toggle.component.css']
})
export class EventToggleComponent {
  isActive = false;
  showForm = false;

  constructor(private communicationService: CommunicationService) {
  }

  activateReceptiveMode() {
    this.communicationService.setReceptiveMode(true);
  }

  toggle(): any {
    this.isActive = !this.isActive;
    this.activateReceptiveMode();
  }
}
