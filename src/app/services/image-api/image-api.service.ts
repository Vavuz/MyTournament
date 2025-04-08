import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {
  private PROXY_URL = 'https://mytournamentbackend.onrender.com/api/image';

  constructor(private http: HttpClient) {}

  getImageForItem(itemName: string): Observable<string> {
    const url = `${this.PROXY_URL}?q=${encodeURIComponent(itemName)}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        return response.link || "https://demofree.sirv.com/nope-not-here.jpg";
      })
    );
  }
}