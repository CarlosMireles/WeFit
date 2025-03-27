import { Component } from '@angular/core';
import {EventToggleComponent} from "../../components/event-toggle/event-toggle.component";
import {MapComponent} from "../../components/map/map.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";


@Component({
  selector: 'app-home',
    imports: [
        EventToggleComponent,
        MapComponent,
        SearchBarComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
