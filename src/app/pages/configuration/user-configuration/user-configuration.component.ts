import { Component, EventEmitter, Output } from '@angular/core';
import {LanguageService} from '../../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-configuration',
  imports: [
    TranslatePipe
  ],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.css'
})
export class UserConfigurationComponent {
  @Output() editProfile = new EventEmitter<void>();

  constructor(private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  onEditProfileClick(): void {
    this.editProfile.emit();
  }
}
