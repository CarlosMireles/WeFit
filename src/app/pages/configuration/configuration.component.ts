import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {UserConfigurationComponent} from './user-configuration/user-configuration.component';
import {EditProfileComponent} from './user-configuration/edit-profile/edit-profile.component';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';
import {BestFriendsComponent} from './best-friends/best-friends.component';
import {AddBestFriendsComponent} from './best-friends/add-best-friends/add-best-friends.component';

@Component({
  selector: 'app-configuration',
  imports: [
    NgIf,
    NgForOf,
    UserConfigurationComponent,
    EditProfileComponent,
    TranslatePipe,
    BestFriendsComponent,
    AddBestFriendsComponent
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  selectedSection = 'usuario';
  showEditProfile = false;
  showAddBestFriends = false;

  constructor(private router: Router, private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  sections = [
    { key: 'usuario', label: 'configuration.user'},
    { key: 'notificaciones', label: 'configuration.notification'},
    { key: 'mejos', label: 'configuration.close-friends'},
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

  onAddBestFriendClicked(): void {
    this.showAddBestFriends = true;
  }

  onAddBestFriendBackClicked(): void {
    this.showAddBestFriends = false;
  }
}
