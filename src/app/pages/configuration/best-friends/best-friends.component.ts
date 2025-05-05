import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {UserTemplateImageNameComponent} from './user-template-image-name/user-template-image-name.component';
import {UserService} from '../../../services/user.service';
import {LoadingCircleComponent} from '../../../components/loading-circle/loading-circle.component';

interface UserInfo {
  uid: string;
  username: string;
  image_url: string;
}

@Component({
  selector: 'app-best-friends',
  standalone: true,
  imports: [CommonModule, UserTemplateImageNameComponent, LoadingCircleComponent],
  templateUrl: './best-friends.component.html',
  styleUrl: './best-friends.component.css'
})
export class BestFriendsComponent implements OnInit {
  @Output() AddFriend = new EventEmitter<void>();
  private best_friends: any;
  bestFriendsUsers: UserInfo[] = [];

  isLoading: boolean = false;

  constructor(private router: Router,
              private userService: UserService) {}

  navigateToAddFriend(): void {
    this.AddFriend.emit();
  }

  async ngOnInit() {
    this.isLoading = true;

    const uid = await this.userService.getCurrentUserUid();
    if (!uid) {
      this.isLoading = false;
      return;
    }

    const data = await this.userService.getUserData(uid);
    if (!data) {
      this.isLoading = false;
      return;
    }

    this.best_friends = data['best_friends'] || [];

    for (let u in this.best_friends) {
      const user = await this.userService.getUserData(this.best_friends[u]);
      if (!user) continue;

      this.bestFriendsUsers.push({
        uid: user['uid'],
        username: user['username'],
        image_url: user['image_url']
      });
    }

    this.isLoading = false;
  }

  removeBestFriend(friend: UserInfo) {
    this.userService.removeBestFriend(friend.uid).then(() => {
      // Eliminar el amigo de la lista local
      this.bestFriendsUsers = this.bestFriendsUsers.filter(user => user.uid !== friend.uid);
    }).catch(error => {
      console.error('Error al eliminar mejor amigo:', error);
    });
  }
}
