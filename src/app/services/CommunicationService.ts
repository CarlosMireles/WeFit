import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventFilters } from './event.service';  // Asegúrate de importar la interfaz de filtros

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private eventCreationModeSubject = new BehaviorSubject<boolean>(false);
  eventCreationMode$ = this.eventCreationModeSubject.asObservable();

  private mapClickSubject = new Subject<{ lat: number; lon: number }>();
  mapClick$ = this.mapClickSubject.asObservable();

  private eventCreatedSubject = new BehaviorSubject<boolean>(false);
  eventCreated$ = this.eventCreatedSubject.asObservable();

  // Nuevo canal para filtros aplicados
  private filterAppliedSubject = new Subject<EventFilters>();
  filterApplied$ = this.filterAppliedSubject.asObservable();

  getEventCreationMode(): boolean {
    return this.eventCreationModeSubject.getValue();
  }

  setEventCreationMode(value: boolean) {
    this.eventCreationModeSubject.next(value);
  }

  notifyMapClick(data: { lat: number; lon: number }) {
    if (this.getEventCreationMode()) {
      this.mapClickSubject.next(data);
    }
  }

  notifyEventCreated(value: boolean){
    this.eventCreatedSubject.next(value);
  }

  // Método para notificar que se aplicaron filtros
  notifyFiltersApplied(filters: EventFilters) {
    this.filterAppliedSubject.next(filters);
  }
}
