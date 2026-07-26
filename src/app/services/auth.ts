import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private passeportUrl = 'http://localhost:3000/api/passeport';

  constructor(private http: HttpClient) {}

  inscrire(data: any) {
    return this.http.post(`${this.apiUrl}/inscription`, data);
  }

  connecter(data: any) {
    return this.http.post(`${this.apiUrl}/connexion`, data);
  }

  telechargerPasseport() {
    const token = localStorage.getItem('kofis_token');
    return this.http.get(`${this.passeportUrl}/telecharger`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  }
}