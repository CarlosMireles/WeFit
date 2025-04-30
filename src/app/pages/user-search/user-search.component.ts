// src/app/pages/user-search/user-search.component.ts
import { Component } from '@angular/core';
import { FindUserComponent } from '../../components/find-user/find-user.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FindHistoryComponent } from '../../components/find-history/find-history.component';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [
    SearchBarComponent,
    FindUserComponent,
    FindHistoryComponent
  ],
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {}
