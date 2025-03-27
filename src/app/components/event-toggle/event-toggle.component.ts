import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-toggle.component.html',
  styleUrls: ['./event-toggle.component.css']
})
export class EventToggleComponent {
  isActive = false;

  toggle(): void {
    this.isActive = !this.isActive;
  }
}
