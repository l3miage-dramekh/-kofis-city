import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private router: Router) {}

  estConnecte(): boolean {
    return !!localStorage.getItem('kofis_token');
  }

deconnecter() {
  const confirmation = window.confirm('Tu veux vraiment te déconnecter de KOFIS City ?');
  if (confirmation) {
    localStorage.removeItem('kofis_token');
    localStorage.removeItem('kofis_user');
    this.router.navigate(['/']);
  }
}
}