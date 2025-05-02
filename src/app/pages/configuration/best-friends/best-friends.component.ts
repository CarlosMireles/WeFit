import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {UserTemplateImageNameComponent} from './user-template-image-name/user-template-image-name.component';

interface Friend {
  id: number;
  name: string;
  username: string;
  profilePicture: string;
}

@Component({
  selector: 'app-best-friends',
  standalone: true,
  imports: [CommonModule, UserTemplateImageNameComponent],
  templateUrl: './best-friends.component.html',
  styleUrl: './best-friends.component.css'
})
export class BestFriendsComponent {
  @Output() AddFriend = new EventEmitter<void>();
  friends: Friend[] = [];

  constructor(private router: Router) {}

  navigateToAddFriend(): void {
    this.AddFriend.emit();
  }
}
