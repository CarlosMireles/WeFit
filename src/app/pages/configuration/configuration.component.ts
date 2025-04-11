import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {UserConfigurationComponent} from './user-configuration/user-configuration.component';

@Component({
  selector: 'app-configuration',
  imports: [
    NgIf,
    NgForOf,
    UserConfigurationComponent
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  selectedSection = 'usuario';

  sections = [
    { key: 'usuario', label: 'Configuración de Usuario'},
    { key: 'notificaciones', label: 'Notificaciones'},
    { key: 'mejos', label: 'Mejores amigos'},
  ];

  selectSection(section: string): void {
    this.selectedSection = section;
  }

  goBack() {

  }
}
