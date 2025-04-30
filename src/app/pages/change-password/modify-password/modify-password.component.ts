import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LanguageService} from '../../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-modify-password',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './modify-password.component.html',
  standalone: true,
  styleUrl: './modify-password.component.css'
})
export class ModifyPasswordComponent {
  user = {
    password: '',
    confirmPassword: ''
  };

  constructor(private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  onSubmit(form: any) {
    this.user.password = form.value.password;
    this.user.confirmPassword = form.value.confirmPassword;
  }
}
