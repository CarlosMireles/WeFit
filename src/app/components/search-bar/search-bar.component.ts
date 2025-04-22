import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {CommunicationService} from '../../services/CommunicationService';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  constructor(
    private router: Router,
    private comm: CommunicationService
  ) {}

  /** Pulsado el botón Home → limpiar selección y navegar */
  goHome(): void {
    this.comm.clearLastSelected();
    // routerLink del template hace la navegación; esto es un refuerzo.
    this.router.navigate(['/home']);
  }
}
