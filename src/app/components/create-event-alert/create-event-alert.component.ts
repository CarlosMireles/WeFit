import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'create-event-alert',
  templateUrl: './create-event-alert.component.html',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  styleUrls: ['./create-event-alert.component.css']
})
export class CreateEventAlertComponent {
  @Output() accept = new EventEmitter<void>();

  onAccept(event: MouseEvent): void {
    event.stopPropagation();
    this.accept.emit();
    console.log('Alerta aceptada');
  }

  onOverlayClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
