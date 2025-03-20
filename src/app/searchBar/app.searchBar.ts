import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'searchBar-searchBar',
  imports: [NgOptimizedImage],
  templateUrl: './app.searchBar.html',
  standalone: true,
  styleUrl: './app.searchBar.css'
})
export class searchBarComponent{
  title = 'untitled1';

}
