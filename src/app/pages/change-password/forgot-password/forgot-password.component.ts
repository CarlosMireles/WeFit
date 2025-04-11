import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../../services/translate.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  user = {
    email: ''
  };

  constructor(private langService: LanguageService) {}

  onSubmit(form: any) {
    this.user.email = form.value.email;
    console.log('Correo de recuperacion:', this.user);
  }

}
