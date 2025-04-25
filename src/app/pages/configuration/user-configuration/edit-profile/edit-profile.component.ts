import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationQuestionComponent } from '../../../../components/confirmation-question/confirmation-question.component';
import { UserService } from '../../../../services/user.service';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationQuestionComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  // **Importante** Este código implementa una función para comprobar en tiempo
  //                real que el nombre de usuario no esté ya en uso mediante la
  //                función checkUsernameAvailability. Esta función no ha sido
  //                probado todavía ya que espera a la conexión a un servidor

  @Output() backClicked = new EventEmitter<void>();

  profileData = {
    username: '',
    description: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  maxDescriptionLength = 150;

  // Control de visibilidad y tipo de pop-up
  showConfirmation: boolean = false;
  confirmationType: 'save' | 'exit' = 'save';

  // Textos para el pop-up según el tipo
  confirmationTexts = {
    save: {
      title: 'Guardar cambios',
      message: '¿Estás seguro de que quieres guardar los cambios en tu perfil?',
      confirmText: 'Guardar',
      cancelText: 'Cancelar'
    },
    exit: {
      title: 'Descartar cambios',
      message: 'Si sales ahora, los cambios no guardados se perderán. ¿Deseas continuar?',
      confirmText: 'Sí, salir',
      cancelText: 'No, continuar editando'
    }
  };

  usernameAvailabilityMessage: string = ''; // Mensaje de disponibilidad del nombre de usuario

  constructor(private userService: UserService) {  }

  ngOnInit(): void {
    this.getProfileData();

    // Asegurar que la descripción inicial no exceda el máximo
    if (this.profileData.description.length > this.maxDescriptionLength) {
      this.profileData.description = this.profileData.description.substring(0, this.maxDescriptionLength);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges(): void {
    this.confirmationType = 'save';
    this.showConfirmation = true;
    this.uploadChanges();
  }

  goBack(): void {
    this.confirmationType = 'exit';
    this.showConfirmation = true;
  }

  // Método para manejar la confirmación
  onConfirm(): void {
    if (this.confirmationType === 'save') {
      // Lógica para guardar cambios
      console.log('Guardando cambios:', this.profileData);
      alert('Perfil actualizado correctamente');
      this.backClicked.emit(); // Volver atrás después de guardar
    } else {
      // Lógica para salir sin guardar
      console.log('Saliendo sin guardar cambios');
      this.backClicked.emit();
    }
    this.showConfirmation = false;
  }

  // Método para manejar la cancelación
  onCancel(): void {
    console.log('Operación cancelada por el usuario');
    this.showConfirmation = false;
  }

  onDescriptionInput(): void {
    if (this.profileData.description.length > this.maxDescriptionLength) {
      this.profileData.description = this.profileData.description.substring(0, this.maxDescriptionLength);
    }
  }

  getDescriptionLength(): number {
    return this.profileData.description ? this.profileData.description.length : 0;
  }

  onUsernameInput(): void {
    if (this.profileData.username) {
      const filteredUsername = this.profileData.username.replace(/[\s\n\r]/g, '');

      if (filteredUsername !== this.profileData.username) {
        this.profileData.username = filteredUsername;
      }
    }
    this.checkUsernameAvailability(); // Llamar a la función de comprobación
  }

  checkUsernameAvailability(): void {
    // Por ahora no realiza ninguna comprobación
    // En el futuro, aquí se puede implementar la lógica para verificar si el nombre de usuario ya está en uso
    const username = this.profileData.username;

    if (!username) {
      this.usernameAvailabilityMessage = '';
      return;
    }

    // Ejemplo de mensaje (esto se reemplazará con la lógica real)
    this.usernameAvailabilityMessage = 'Comprobando disponibilidad...';
  }

  // Métodos para obtener el texto correcto según el tipo de confirmación
  getConfirmationTitle(): string {
    return this.confirmationTexts[this.confirmationType].title;
  }

  getConfirmationMessage(): string {
    return this.confirmationTexts[this.confirmationType].message;
  }

  getConfirmText(): string {
    return this.confirmationTexts[this.confirmationType].confirmText;
  }

  getCancelText(): string {
    return this.confirmationTexts[this.confirmationType].cancelText;
  }

  private async getProfileData() {
    const userId = await this.userService.getCurrentUserUid();
    if (!userId) return;

    this.userService.getUserData(userId).then(r => {
      if (r) {
        this.profileData.username = r['username'];
        this.profileData.description = r['description'];
        this.previewUrl = r['image_url'];
      }
    });
  }

  private uploadChanges() {
    this.userService.updateUsername(this.profileData.username).then();
    this.userService.updateDescription(this.profileData.description).then();

    if (typeof this.previewUrl === 'string') {
      this.userService.updateProfilePicture(this.previewUrl).then();
    } else {
      console.warn('La URL de imagen no es válida');
    }
  }
}

