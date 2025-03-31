import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-modify-password',
  imports: [FormsModule],
  templateUrl: './modify-password.component.html',
  standalone: true,
  styleUrl: './modify-password.component.css'
})
export class ModifyPasswordComponent {
  user = {
    password: '',
    confirmPassword: ''
  };

  onSubmit(form: any) {
    this.user.password = form.value.password;
    this.user.confirmPassword = form.value.confirmPassword;
  }
}
