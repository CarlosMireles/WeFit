import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../services/translate.service';
import {CommunicationService} from '../../services/CommunicationService';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  constructor(
    private router: Router,
    private comm: CommunicationService,
    private langService: LanguageService
  ) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  /** Pulsado el botón Home → limpiar selección y navegar */
  goHome(): void {
    this.comm.clearLastSelected();
    // routerLink del template hace la navegación; esto es un refuerzo.
    this.router.navigate(['/home']);
  }
}
