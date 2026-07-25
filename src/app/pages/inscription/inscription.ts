import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, Navbar],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription {
  prenom = '';
  nom = '';
  email = '';
  ville = '';
  pole = '';

  constructor(private router: Router) {}

  inscrire() {
    if (this.prenom && this.nom) {
      localStorage.setItem('kofis_user', JSON.stringify({
        prenom: this.prenom,
        nom: this.nom,
        ville: this.ville,
        pole: this.pole
      }));
      this.router.navigate(['/dashboard']);
    }
  }
}