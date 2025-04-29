import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';

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

  userService: UserService = inject(UserService);

  constructor(private router: Router) {}

  onSubmit(form: any) {
    this.user.email = form.value.email;
    this.userService.resetPassword(this.user.email);
    form.resetFields();
    this.router.navigate(['/login']);
  }
}
