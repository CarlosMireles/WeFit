import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileData = {
    username: 'usuario_ejemplo',
    description: 'Esta es una descripción de ejemplo para el perfil.',
    profilePicture: 'https://via.placeholder.com/150'
  };

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor() { }

  ngOnInit(): void {
    this.previewUrl = this.profileData.profilePicture;
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
    // Aquí iría la lógica para guardar los cambios en un servicio
    console.log('Guardando cambios:', this.profileData);
    alert('Perfil actualizado correctamente');
  }
}
