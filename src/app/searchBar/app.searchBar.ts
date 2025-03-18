import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {UserComponent} from '../user/user.component';

@Component({
  selector: 'searchBar-searchBar',
  imports: [RouterOutlet, NgOptimizedImage, UserComponent],
  templateUrl: './app.searchBar.html',
  standalone: true,
  styleUrl: './app.searchBar.css'
})
export class searchBarComponent implements AfterViewInit {
  title = 'untitled1';
  @ViewChild('user') UserComponent!: UserComponent;

  constructor(private router: Router) {
  }

  ngAfterViewInit(): void {
    //TODO: Redirection if not logged in
    }


  protected readonly ViewChild = ViewChild;
}
