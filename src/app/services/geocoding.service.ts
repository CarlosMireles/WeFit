import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private baseUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  getPlaceFromCoords(lat: number, lon: number): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'User-Agent': 'WeFit-PS'
    });

    const url = `${this.baseUrl}?format=jsonv2&lat=${lat}&lon=${lon}`;

    return this.http.get(url, { headers });
  }
}
