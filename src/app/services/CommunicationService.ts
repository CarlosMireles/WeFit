import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private receptiveModeSubject = new Subject<boolean>();
  receptiveMode$ = this.receptiveModeSubject.asObservable();


  private mapClickSubject = new Subject<any>();
  mapClick$ = this.mapClickSubject.asObservable();


  setReceptiveMode(value: boolean) {
    this.receptiveModeSubject.next(value);
  }


  notifyMapClick(data?: any) {
    this.mapClickSubject.next(data);
  }
}
