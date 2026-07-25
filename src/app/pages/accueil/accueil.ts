import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink, Navbar],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {}