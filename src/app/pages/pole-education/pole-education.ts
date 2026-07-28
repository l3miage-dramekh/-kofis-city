import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-pole-education',
  imports: [Navbar, NgFor],
  templateUrl: './pole-education.html',
  styleUrl: './pole-education.css'
})
export class PoleEducation {
  cours = [
    { emoji: '💻', bg: 'linear-gradient(135deg,#1e1650,#2d1f7a)', categorie: 'Tech & Code', titre: 'Développement Web — De zéro au déploiement', prof: 'Ibrahima Thiam', prix: '15 000' },
    { emoji: '📊', bg: 'linear-gradient(135deg,#2a1020,#6b1a3a)', categorie: 'Statistiques', titre: 'Introduction aux Statistiques Appliquées', prof: 'Ousseynou Leur', prix: '12 000' },
    { emoji: '🤖', bg: 'linear-gradient(135deg,#1a1035,#3d2085)', categorie: 'Intelligence Artificielle', titre: 'Introduction à l\'IA & Machine Learning', prof: 'Soukeye Kane', prix: '18 000' },
    { emoji: '🗣️', bg: 'linear-gradient(135deg,#1a2030,#1a4060)', categorie: 'Langues', titre: 'Français Professionnel pour non-francophones', prof: 'Fallou Fall', prix: '8 000' },
    { emoji: '💼', bg: 'linear-gradient(135deg,#2a1a10,#7a3a10)', categorie: 'Business', titre: 'Créer et Gérer une Startup en Afrique', prof: 'Khoyane Dramé', prix: '20 000' },
    { emoji: '🔧', bg: 'linear-gradient(135deg,#0f2a1e,#1a5c3a)', categorie: 'Backend', titre: 'Node.js & Express — APIs REST de A à Z', prof: 'Khoyane Dramé', prix: '16 000' },
  ];
}