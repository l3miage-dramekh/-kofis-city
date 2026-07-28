import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, Navbar, NgIf],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription {
  prenom = '';
  nom = '';
  email = '';
  password = '';
  confirmPassword = '';
  ville = '';
  pole = '';
  erreur = '';
  chargement = false;
  voirPassword = false;
  voirConfirm = false;

  constructor(private router: Router, private authService: AuthService) {}

  inscrire() {
    if (!this.prenom || !this.nom || !this.email || !this.password) {
      this.erreur = 'Merci de remplir tous les champs obligatoires.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.password.length < 6) {
      this.erreur = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.chargement = true;
    this.erreur = '';

    this.authService.inscrire({
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      password: this.password,
      ville: this.ville,
      pole: this.pole
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('kofis_token', res.token);
        localStorage.setItem('kofis_user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.chargement = false;
        if (err.status === 0) {
          this.erreur = 'Impossible de contacter le serveur. Il est peut-être en train de démarrer, réessaie dans quelques secondes.';
        } else {
          this.erreur = err?.error?.message || 'Une erreur est survenue.';
        }
      }
    });
  }
}