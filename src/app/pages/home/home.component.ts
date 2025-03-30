import { Component } from '@angular/core';
import {EventToggleComponent} from "../../components/event-toggle/event-toggle.component";
import {MapComponent} from "../../components/map/map.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {CreateEventFormComponent} from '../../components/create-event-form/create-event-form.component';
import {CommunicationService} from '../../services/CommunicationService';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-home',
    imports: [
        EventToggleComponent,
        MapComponent,
        SearchBarComponent,
        CreateEventFormComponent,
        NgIf
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showForm: boolean = false;

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    this.communicationService.mapClick$.subscribe(data => {
      this.showForm = true;
    });
  }
}
