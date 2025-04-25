import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-configuration',
  imports: [],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.css'
})
export class UserConfigurationComponent {
  @Output() editProfile = new EventEmitter<void>();

  onEditProfileClick(): void {
    this.editProfile.emit();
  }
}
