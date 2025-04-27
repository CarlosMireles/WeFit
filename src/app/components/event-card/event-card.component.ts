import { Component } from '@angular/core';
import {LanguageService} from '../../services/translate.service';

@Component({
    selector: 'app-event-card',
    imports: [],
    templateUrl: './event-card.component.html',
    standalone: true,
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  constructor(private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

}
