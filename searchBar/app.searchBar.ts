import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'searchBar-searchBar',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './app.searchBar.html',
  standalone: true,
  styleUrl: './app.searchBar.css'
})
export class searchBarComponent {
  title = 'untitled1';
}
