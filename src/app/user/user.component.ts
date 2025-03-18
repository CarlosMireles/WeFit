import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  standalone: true,
  styleUrl: './user.component.css'
})
export class UserComponent {
  login = false
  @Input() name = '';
  @Input() email = '';
  @Input() password = '';
}
