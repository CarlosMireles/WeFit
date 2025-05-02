import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-add-best-friends',
  imports: [],
  templateUrl: './add-best-friends.component.html',
  styleUrl: './add-best-friends.component.css'
})
export class AddBestFriendsComponent implements OnInit{
  @Output() backClickedAddFriend = new EventEmitter<void>();

  currentUserId: string | null = null;

  follows: string[] = [];

  constructor(
    private userService: UserService,
  ) {}

  async ngOnInit() {
    const uid = await this.userService.getCurrentUserUid();
    if (!uid) return;
    this.currentUserId = uid;

    const data = await this.userService.getUserData(uid);
    if (!data) return;

    this.follows     = data['follows']     || [];

    console.log(this.follows);
  }

  goBack() {
    this.backClickedAddFriend.emit();
  }
}
