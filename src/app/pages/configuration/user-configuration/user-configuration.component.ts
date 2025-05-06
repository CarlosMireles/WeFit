import { Component, EventEmitter, Output } from '@angular/core';
import {LanguageService} from '../../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-configuration',
  imports: [
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './user-configuration.component.html',
  standalone: true,
  styleUrl: './user-configuration.component.css'
})
export class UserConfigurationComponent {
  @Output() editProfile = new EventEmitter<void>();
  selectedLang: string = 'es';

  constructor(private langService: LanguageService) {}

  onEditProfileClick(): void {
    this.editProfile.emit();
  }

  changeLanguage() {
    this.langService.changeLang(this.selectedLang);
  }
}
