import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { User, sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
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
    passwordError: '',
    homeRoute: '',
    awaitingVerification: false,
    canResend: true
  };

  private currentUser: User | null = null;
  private verificationInterval: any;

  constructor(private userService: UserService, private router: Router) {}

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
    this.user.awaitingVerification = false;

    if (!this.validateForm()) return;

    try {
      const newUser: User = await this.userService.registerUser(
        this.user.email,
        this.user.password,
        this.user.username
      );

      this.currentUser = newUser;
      this.user.successMessage = '¡Registro exitoso! Revisa tu correo para verificar la cuenta.';
      this.user.awaitingVerification = true;

      // Verificación periódica
      this.verificationInterval = setInterval(async () => {
        await newUser.reload();
        if (newUser.emailVerified) {
          clearInterval(this.verificationInterval);
          this.user.successMessage = 'Correo verificado correctamente. Redirigiendo...';
          this.user.awaitingVerification = false;
          await new Promise(res => setTimeout(res, 1000));
          this.router.navigate(['/home']);
        }
      }, 3000);

    } catch (error: any) {
      this.user.errorMessage = error.message || 'Error al registrar.';
      this.user.successMessage = '';
    }
  }

  async resendVerificationEmail() {
    if (this.currentUser && this.user.canResend) {
      try {
        await sendEmailVerification(this.currentUser);
        this.user.successMessage = 'Correo de verificación reenviado. Revisa tu bandeja de entrada.';
        this.user.canResend = false;

        // Espera 30 segundos para volver a permitir
        setTimeout(() => {
          this.user.canResend = true;
        }, 30000);

      } catch (err: any) {
        this.user.errorMessage = err.message || 'Error al reenviar el correo.';
      }
    }
  }
}
