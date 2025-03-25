import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  onSubmit(form: any) {
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    console.log('User registered:', this.user);
  }
}
