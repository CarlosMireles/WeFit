import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  eventos: any[] = [];   // Para almacenar los eventos obtenidos
  isLoading: boolean = true;  // Variable para indicar si los eventos están cargando
  error: string | null = null;  // Para manejar cualquier error

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.getEvents();  // Llamada a la función para obtener los eventos
  }

  // Método para obtener los eventos y mostrar en consola
  getEvents(): void {
    this.eventService.getEvents()
      .then((eventos) => {
        this.eventos = eventos; // Almacenar los eventos en el array
        this.isLoading = false;  // Cambiar el estado de carga
        console.log('Eventos obtenidos:', eventos); // Mostrar los eventos en consola
        console.log(this.eventos);
      })
      .catch((error) => {
        this.error = 'No se pudieron cargar los eventos';  // Establecer mensaje de error
        this.isLoading = false;  // Cambiar el estado de carga
        console.error('Error al obtener los eventos:', error);  // Mostrar el error en consola
      });
  }
}
