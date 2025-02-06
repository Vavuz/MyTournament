import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private API_KEY = '';
  private BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  getItems(quantity: number, item: string): Observable<any> {
    const requestBody = {
      contents: [{ parts: [{ text: `Send me a JSON list of the ${quantity} most popular ${item}.` }] }]
    };

    return this.http.post(`${this.BASE_URL}?key=${this.API_KEY}`, requestBody);
  }
}