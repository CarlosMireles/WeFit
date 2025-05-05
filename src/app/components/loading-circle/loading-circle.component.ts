import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loading-circle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loading-circle.component.html',
  styleUrl: './loading-circle.component.css'
})
export class LoadingCircleComponent {
  @Input() color: string = '#3498db';
  @Input() size: number = 50; //px
}
