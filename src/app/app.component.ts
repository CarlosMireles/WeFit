import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConfigurationComponent} from './pages/configuration/configuration.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfigurationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WeFit';
}
