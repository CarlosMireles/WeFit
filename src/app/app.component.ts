import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserProfileComponent} from './pages/user-profile/user-profile.component';
import {ForgotPasswordComponent} from './pages/change-password/forgot-password/forgot-password.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WeFit';
}
