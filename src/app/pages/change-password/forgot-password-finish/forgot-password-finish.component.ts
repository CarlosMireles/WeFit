import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LanguageService} from '../../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password-finish',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './forgot-password-finish.component.html',
  standalone: true,
  styleUrl: './forgot-password-finish.component.css'
})
export class ForgotPasswordFinishComponent {

  constructor(private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }
}
