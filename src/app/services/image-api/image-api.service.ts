import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {
  private WIKIMEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

  constructor(private http: HttpClient) {}

  getImageForItem(itemName: string): Observable<string> {
    const url = `${this.WIKIMEDIA_API_URL}?action=query&prop=pageimages&format=json&pithumbsize=500&titles=${encodeURIComponent(itemName)}&origin=*`;

    return this.http.get<any>(url).pipe(
      map(response => {
        const pages = response?.query?.pages || {};
        const firstPage = Object.values(pages)[0] as any;
        return firstPage?.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
      })
    );
  }
}