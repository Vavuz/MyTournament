import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private PROXY_URL = 'https://mytournamentbackend.onrender.com/api/gemini';

  constructor(private http: HttpClient) {}

  getItems(quantity: number, item: string): Observable<any> {
    const prompt = `Send me a JSON list of the ${quantity} most popular ${item}.`;
    const requestBody = {
      model: "gemini-2.0-flash",
      contents: prompt
    };

    return this.http.post(`${this.PROXY_URL}`, requestBody);
  }
}