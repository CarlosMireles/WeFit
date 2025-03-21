import { Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  onSubmit(form: any) {
    this.user.username = form.value.user;
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    console.log('User registered:', this.user);
  }
}
