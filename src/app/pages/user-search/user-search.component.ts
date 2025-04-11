import { Component } from '@angular/core';
import {FindUserComponent} from '../../components/find-user/find-user.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-user-search',
  imports: [
    FindUserComponent,
    SearchBarComponent
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {

}
