import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {MapComponent} from './map/map.component';
import {EventToggleComponent} from './event-toggle/event-toggle.component';
import {searchBarComponent} from './searchBar/app.searchBar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, RouterLink,MapComponent,EventToggleComponent,searchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WeFit';
}
