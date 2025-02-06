import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private apiKey = '';
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  getItems(item: string): Observable<any> {
    const requestBody = {
      contents: [{ parts: [{ text: `Send me a JSON list of the ten most popular ${item}.` }] }]
    };

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, requestBody);
  }
}