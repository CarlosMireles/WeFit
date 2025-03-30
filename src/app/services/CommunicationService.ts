import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Cambio de Subject a BehaviorSubject para mantener el estado
  private receptiveModeSubject = new BehaviorSubject<boolean>(false);
  receptiveMode$ = this.receptiveModeSubject.asObservable();

  private mapClickSubject = new Subject<{ lat: number; lon: number }>();
  mapClick$ = this.mapClickSubject.asObservable();

  private eventCreatedSubject = new Subject<{ lat: number; lon: number; titulo: string }>();
  eventCreated$ = this.eventCreatedSubject.asObservable();

  // Método para obtener el valor actual del modo receptivo
  getReceptiveMode(): boolean {
    return this.receptiveModeSubject.getValue();
  }

  setReceptiveMode(value: boolean) {
    this.receptiveModeSubject.next(value);
  }

  notifyMapClick(data: { lat: number; lon: number }) {
    // Solo notificar clicks cuando estamos en modo receptivo
    if (this.getReceptiveMode()) {
      this.mapClickSubject.next(data);
    }
  }

  notifyEventCreated(event: { lat: number; lon: number; titulo: string }) {
    this.eventCreatedSubject.next(event);
  }
}
