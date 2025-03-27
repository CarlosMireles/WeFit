import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {UserService} from '../../services/user.service';

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

  constructor(private userService: UserService, private router: Router) {}

  async onSubmit(form: any) {
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    try {
      const loggedUser = await this.userService.loginUser(this.user.email, this.user.password);
      console.log('User logged in:', loggedUser);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
}
