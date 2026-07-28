import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, Navbar, NgIf, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css'
})
export class Connexion {
  email = '';
  password = '';
  erreur = '';
  chargement = false;
  voirPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  connecter() {
    if (!this.email || !this.password) {
      this.erreur = 'Merci de remplir tous les champs.';
      return;
    }

    this.chargement = true;
    this.erreur = '';

    this.authService.connecter({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('kofis_token', res.token);
        localStorage.setItem('kofis_user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.erreur = err.error.message || 'Email ou mot de passe incorrect.';
        this.chargement = false;
      }
    });
  }
}