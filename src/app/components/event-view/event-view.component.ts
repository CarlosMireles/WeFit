import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../services/translate.service';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent {
  @Input() eventData: any;
  @Output() close = new EventEmitter<void>();

  constructor(private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  onClose(): void {
    this.close.emit();
  }
}
