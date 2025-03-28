import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ForgotPasswordFinishComponent} from './forgot-password-finish/forgot-password-finish.component';
import {ModifyPasswordComponent} from './modify-password/modify-password.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, ForgotPasswordComponent, ForgotPasswordFinishComponent, ModifyPasswordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WeFit';
}
