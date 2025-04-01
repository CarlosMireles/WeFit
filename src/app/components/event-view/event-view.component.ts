import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent {
  @Input() eventData: any;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
