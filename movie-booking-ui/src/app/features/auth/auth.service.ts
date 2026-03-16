import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // 🔐 LOGIN (backend returns TEXT)
  login(username: string, password: string): Observable<string> {
    return this.http.get(
      `${this.baseUrl}/login`,
      {
        params: { username, password },
        responseType: 'text'
      }
    );
  }

  // 📝 REGISTER
  register(data: any): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      { responseType: 'text' }
    );
  }

  // 🔁 FORGOT PASSWORD
  forgotPassword(username: string, newPassword: string): Observable<string> {
    return this.http.get(
      `${this.baseUrl}/${username}/forgot`,
      {
        params: { newPassword },
        responseType: 'text'
      }
    );
  }
}
