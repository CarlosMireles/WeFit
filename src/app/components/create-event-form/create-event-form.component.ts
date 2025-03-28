import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent implements OnInit {
  // Usamos '!' para indicar que la variable será inicializada antes de su uso
  eventForm!: FormGroup;

  // Lista de deportes predeterminada
  deportes: string[] = ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Running'];

  // Opciones para privacidad
  privacidades: string[] = ['Privado', 'Público', 'Mejores amigos'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      titulo: ['', Validators.required],
      deporte: ['', Validators.required],
      descripcion: [''],
      fecha: ['', Validators.required],
      // Validamos la hora en formato 00:00 (24h)
      hora: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        ]
      ],
      maxParticipantes: ['', [Validators.required, Validators.min(1)]],
      privacidad: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      console.log('Evento creado:', this.eventForm.value);
      // Aquí puedes agregar la lógica para guardar o enviar el formulario
    } else {
      console.log('Formulario inválido');
    }
  }
}
