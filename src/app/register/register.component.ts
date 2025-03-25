import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
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
    errorMessage: '',
    usernameError: '',
    emailError: '',
    passwordError: ''
  };

  constructor(private userService: UserService) {}

  validateForm() {
    this.user.usernameError = '';
    this.user.emailError = '';
    this.user.passwordError = '';

    let isValid = true;

    if (!this.user.username) {
      this.user.usernameError = 'El nombre de usuario es obligatorio.';
      isValid = false;
    }

    if (!this.user.email) {
      this.user.emailError = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
      this.user.emailError = 'El correo electrónico no es válido.';
      isValid = false;
    }

    if (!this.user.password) {
      this.user.passwordError = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (this.user.password.length < 6) {
      this.user.passwordError = 'Use al menos 6 caracteres.';
      isValid = false;
    }

    return isValid;
  }

  async onSubmit(form: any) {
    this.user.username = form.value.user;
    this.user.email = form.value.email;
    this.user.password = form.value.password;

    this.user.successMessage = '';
    this.user.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    try {
      const user = await this.userService.registerUser(this.user.email, this.user.password, this.user.username);
      this.user.successMessage = "¡Registro exitoso! 🎉";
      console.log("Usuario registrado:", user);
    } catch (error) {
      this.user.errorMessage = "Error al registrar el usuario ❌";
      console.error("Error en el registro:", error);
    }
  }
}
