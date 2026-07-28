import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

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
  email = '';
  initiales = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const data = localStorage.getItem('kofis_user');
    if (data) {
      const user = JSON.parse(data);
      this.prenom = user.prenom;
      this.nom = user.nom;
      this.ville = user.ville;
      this.pole = user.pole;
      this.email = user.email;
      this.initiales = user.prenom[0] + user.nom[0];
    } else {
      this.router.navigate(['/inscription']);
    }
  }

  telechargerPasseport() {
    this.authService.telechargerPasseport().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `passeport-kofis-${this.prenom}-${this.nom}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.log('Erreur téléchargement', err)
    });
  }
}