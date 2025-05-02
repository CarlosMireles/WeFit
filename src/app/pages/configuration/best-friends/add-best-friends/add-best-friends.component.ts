import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {UserTemplateImageNameComponent} from '../user-template-image-name/user-template-image-name.component';
import {NgForOf, NgIf, NgClass} from '@angular/common';

interface UserInfo {
  uid: string;
  username: string;
  image_url: string;
}

@Component({
  selector: 'app-add-best-friends',
  standalone: true,
  imports: [
    UserTemplateImageNameComponent,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './add-best-friends.component.html',
  styleUrl: './add-best-friends.component.css'
})
export class AddBestFriendsComponent implements OnInit{
  @Output() backClickedAddFriend = new EventEmitter<void>();

  best_friends: string[] = [];

  followedUsers: UserInfo[] = [];
  selectedUsers: UserInfo[] = [];
  currentUserId: string | null = null;
  follows: string[] = [];

  constructor(
    private userService: UserService
  ) {}

  async ngOnInit() {
    const uid = await this.userService.getCurrentUserUid();
    if (!uid) return;
    this.currentUserId = uid;

    const data = await this.userService.getUserData(uid);
    if (!data) return;

    this.follows = data['follows'] || [];
    this.best_friends = data['best_friends'] || [];

    for (let u in this.best_friends) {
      const user = await this.userService.getUserData(this.follows[u]);
      if (!user) continue;

      this.best_friends.push(user['uid']);
    }

    for (let u in this.follows) {
      const user = await this.userService.getUserData(this.follows[u]);
      if (!user) continue;

      if (this.best_friends.includes(user['uid'])) {
        continue;
      }

      this.followedUsers.push({
        uid: user['uid'],
        username: user['username'],
        image_url: user['image_url']
      });
    }
  }

  goBack() {
    this.backClickedAddFriend.emit();
  }

  async saveBestFriends() {
    for (let u in this.selectedUsers) {
      const user = this.selectedUsers[u];
      if (!user) continue;

      await this.userService.addBestFriend(user.uid);
    }

    this.goBack(); // Volver atrás después de guardar
  }

  toggleUserSelection(user: UserInfo) {
    const index = this.selectedUsers.findIndex(u => u.uid === user.uid);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isUserSelected(user: UserInfo): boolean {
    return this.selectedUsers.some(u => u.uid === user.uid);
  }
}
