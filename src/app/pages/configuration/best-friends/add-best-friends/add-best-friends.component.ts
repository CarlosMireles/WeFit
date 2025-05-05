import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {UserTemplateImageNameComponent} from '../user-template-image-name/user-template-image-name.component';
import {NgForOf, NgIf, NgClass} from '@angular/common';
import {LoadingCircleComponent} from '../../../../components/loading-circle/loading-circle.component';
import {
  ConfirmationQuestionComponent
} from '../../../../components/confirmation-question/confirmation-question.component';

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
    NgClass,
    LoadingCircleComponent
    NgClass,
    ConfirmationQuestionComponent
  ],
  templateUrl: './add-best-friends.component.html',
  styleUrl: './add-best-friends.component.css'
})
export class AddBestFriendsComponent implements OnInit{
  @Output() backClickedAddFriend = new EventEmitter<void>();

  isLoading: boolean = false;

  showConfirmation: boolean = false;

  best_friends: string[] = [];

  followedUsers: UserInfo[] = [];
  selectedUsers: UserInfo[] = [];
  currentUserId: string | null = null;
  follows: string[] = [];

  constructor(
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    const uid = await this.userService.getCurrentUserUid();
    if (!uid) {
      this.isLoading = false;
      return;
    }
    this.currentUserId = uid;

    const data = await this.userService.getUserData(uid);
    if (!data) {
      this.isLoading = false;
      return;
    }

    this.follows = data['follows'] || [];
    this.best_friends = data['best_friends'] || [];

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
    this.isLoading = false;
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

  onConfirm() {
    this.saveBestFriends();
    this.showConfirmation = false;
  }

  onCancel() {
    this.showConfirmation = false;
  }

  showConfirm() {
    this.showConfirmation = true;
  }
}
