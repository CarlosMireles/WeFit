import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCardComponent } from '../filter-card/filter-card.component';
import {CommonJsUsageWarnPlugin} from '@angular-devkit/build-angular/src/tools/webpack/plugins';
import {CommunicationService} from '../../services/CommunicationService';

@Component({
  selector: 'app-filter-toggle',
  standalone: true,
  imports: [CommonModule, FilterCardComponent],
  templateUrl: './filter-toggle.component.html',
  styleUrls: ['./filter-toggle.component.css']
})
export class FilterToggleComponent {
  // Controla la visualización de la tarjeta modal para filtrar.
  showFilterCard = false;

  constructor(
    private communicationService: CommunicationService,
  ) {}

  get creationMode(): boolean {
    return this.communicationService.getEventCreationMode();
  }

  toggleFilterCard(): void {
    if (this.creationMode) {
      return;
    }
    this.showFilterCard = !this.showFilterCard;
  }
}
