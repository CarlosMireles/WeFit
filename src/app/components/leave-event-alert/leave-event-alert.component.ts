import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'leave-event-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-event-alert.component.html',
  styleUrls: ['./leave-event-alert.component.css']
})
export class LeaveEventAlertComponent {
  @Input() eventTitle: string = '';
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAccept(evt: MouseEvent) {
    evt.stopPropagation();
    this.accept.emit();
  }
  onCancel(evt: MouseEvent) {
    evt.stopPropagation();
    this.cancel.emit();
  }
  onOverlayClick(evt: MouseEvent) {
    evt.stopPropagation();
    this.cancel.emit();
  }
}
