import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import type { EventFilters } from './event.service';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  /* ─── Subjects ─────────────────────────────────────────── */
  private eventCreationModeSubject = new BehaviorSubject<boolean>(false);
  eventCreationMode$ = this.eventCreationModeSubject.asObservable();

  private mapClickSubject = new Subject<{ lat: number; lon: number }>();
  mapClick$ = this.mapClickSubject.asObservable();

  private eventCreatedSubject = new BehaviorSubject<boolean>(false);
  eventCreated$ = this.eventCreatedSubject.asObservable();

  private filterAppliedSubject = new Subject<EventFilters>();
  filterApplied$ = this.filterAppliedSubject.asObservable();

  private eventSelectedSubject =
    new BehaviorSubject<{ id: string; latitude: number; longitude: number } | null>(null);
  eventSelected$ = this.eventSelectedSubject.asObservable();

  get lastSelected() {
    return this.eventSelectedSubject.getValue();
  }

  getEventCreationMode(): boolean {
    return this.eventCreationModeSubject.getValue();
  }

  setEventCreationMode(v: boolean) {
    this.eventCreationModeSubject.next(v);
  }

  notifyMapClick(coords: { lat: number; lon: number }) {
    if (this.getEventCreationMode()) this.mapClickSubject.next(coords);
  }

  notifyEventCreated(created = true) {
    this.eventCreatedSubject.next(created);
  }

  notifyFiltersApplied(f: EventFilters) {
    this.filterAppliedSubject.next(f);
  }

  notifyEventSelected(d: { id: string; latitude: number; longitude: number }) {
    this.eventSelectedSubject.next(d);
  }

  clearLastSelected() {
    this.eventSelectedSubject.next(null);
  }
}
