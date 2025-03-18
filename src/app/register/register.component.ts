import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  async onSubmit(event: Event) {
    event.preventDefault(); // Evita recargar la página

    try {
      const user = await this.userService.registerUser(this.email, this.password, this.username);
      this.successMessage = "Registro exitoso ✅";
      this.errorMessage = '';
      console.log("Usuario registrado:", user);
    } catch (error) {
      this.successMessage = '';
      this.errorMessage = "Error al registrar el usuario ❌";
      console.error("Error en el registro:", error);
    }
  }
}

