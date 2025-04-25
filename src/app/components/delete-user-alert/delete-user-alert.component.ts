import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'delete-user-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-user-alert.component.html',
  styleUrls: ['./delete-user-alert.component.css']
})
export class DeleteUserAlertComponent {
  @Input() userName: string = '';
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAccept(event: MouseEvent) {
    event.stopPropagation();
    this.accept.emit();
  }

  onCancel(event: MouseEvent) {
    event.stopPropagation();
    this.cancel.emit();
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    this.cancel.emit();
  }
}
