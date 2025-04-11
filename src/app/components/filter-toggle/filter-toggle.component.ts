import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCardComponent } from '../filter-card/filter-card.component';

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

  toggleFilterCard(): void {
    this.showFilterCard = !this.showFilterCard;
  }
}
