import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
    imports: [
        FormsModule
    ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  user = {
    email: ''
  };

  onSubmit(form: any) {
    this.user.email = form.value.email;
    console.log('Correo de recuperacion:', this.user);
  }
}
