import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'delete-event-alert',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './delete-event-alert.component.html',
  styleUrls: ['./delete-event-alert.component.css']
})
export class DeleteEventAlertComponent {
  /** Título (o cualquier dato) del evento a mostrar en el mensaje */
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
