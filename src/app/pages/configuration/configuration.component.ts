import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {UserConfigurationComponent} from './user-configuration/user-configuration.component';
import {EditProfileComponent} from './user-configuration/edit-profile/edit-profile.component';

@Component({
  selector: 'app-configuration',
  imports: [
    NgIf,
    NgForOf,
    UserConfigurationComponent,
    EditProfileComponent
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  selectedSection = 'usuario';
  showEditProfile = false;

  constructor(private router: Router) {}

  sections = [
    { key: 'usuario', label: 'Configuración de Usuario'},
    { key: 'notificaciones', label: 'Notificaciones'},
    { key: 'mejos', label: 'Mejores amigos'},
  ];

  selectSection(section: string): void {
    this.selectedSection = section;
    this.showEditProfile = false;
  }

  goBack() {
    this.router.navigate(['/userProfile']);
  }

  onEditProfileClicked(): void {
    this.showEditProfile = true;
  }

  onEditProfileBackClicked(): void {
    this.showEditProfile = false;
  }
}
