import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  prenom = '';
  nom = '';
  ville = '';
  pole = '';
  initiales = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('kofis_user');
    if (data) {
      const user = JSON.parse(data);
      this.prenom = user.prenom;
      this.nom = user.nom;
      this.ville = user.ville;
      this.pole = user.pole;
      this.initiales = user.prenom[0] + user.nom[0];
    } else {
      this.router.navigate(['/inscription']);
    }
  }
}