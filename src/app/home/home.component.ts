import { Component } from '@angular/core';
import {EventToggleComponent} from "../event-toggle/event-toggle.component";
import {MapComponent} from "../map/map.component";
import {RouterOutlet} from "@angular/router";
import {searchBarComponent} from "../searchBar/app.searchBar";

@Component({
  selector: 'app-home',
    imports: [
        EventToggleComponent,
        MapComponent,
        RouterOutlet,
        searchBarComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
