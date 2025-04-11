import { Component } from '@angular/core';
import { LanguageService } from '../services/translate.service';

@Component({
  selector: 'app-language-button',
  imports: [],
  templateUrl: './language-button.component.html',
  standalone: true,
  styleUrl: './language-button.component.css'
})
export class LanguageButtonComponent {
  isDropdownOpen = false;

  private allLangs = ['en', 'es'];

  constructor(private langService: LanguageService) {}

  get currentLang(): string {
    return this.langService.currentLang;
  }

  get availableLangs(): string[] {
    return this.allLangs.filter(lang => lang !== this.currentLang);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  switchLang(lang: string): void {
    this.langService.changeLang(lang);
    this.isDropdownOpen = false;
  }
}
