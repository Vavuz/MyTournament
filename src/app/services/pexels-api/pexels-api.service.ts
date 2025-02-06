import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PexelsApiService {
  private API_KEY = '';
  private BASE_URL = 'https://api.pexels.com/v1/search';

  constructor(private http: HttpClient) {}

  getImageForItem(itemName: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: this.API_KEY
    });

    return this.http.get<any>(`${this.BASE_URL}?query=${encodeURIComponent(itemName)}&per_page=1`, { headers }).pipe(
      map(response => response.photos.length > 0 ? response.photos[0].src.large : '')
    );
  }
}