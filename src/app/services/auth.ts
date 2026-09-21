import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private passeportUrl = 'https://kofis-backend-pnpm.onrender.com/api/passeport';
  
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