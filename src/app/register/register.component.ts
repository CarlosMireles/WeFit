import { Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    successMessage: '',
    errorMessage: ''
  };

  constructor(private userService: UserService) {}

  async onSubmit(form: any) {
    // event.preventDefault();
    this.user.username = form.value.user;
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    console.log('User registered:', this.user);
    try {
      const user = await this.userService.registerUser(this.user.email, this.user.password, this.user.username);
      this.user.successMessage = "Registro exitoso ✅";
      this.user.errorMessage = '';
      console.log("Usuario registrado:", user);
    } catch (error) {
      this.user.successMessage = '';
      this.user.errorMessage = "Error al registrar el usuario ❌";
      console.error("Error en el registro:", error);
    }
  }
}
