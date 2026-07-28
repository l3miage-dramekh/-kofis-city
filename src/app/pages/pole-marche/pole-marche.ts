import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-pole-marche',
  imports: [Navbar, NgFor],
  templateUrl: './pole-marche.html',
  styleUrl: './pole-marche.css'
})
export class PoleMarche {
  produits = [
    { emoji: '👗', bg: 'linear-gradient(135deg,#2a1020,#6b1a3a)', categorie: 'Mode', nom: 'Robe en bazin riche', vendeur: 'Aminata Diallo', prix: '25 000', ville: 'Dakar' },
    { emoji: '📱', bg: 'linear-gradient(135deg,#1a1035,#3d2085)', categorie: 'Électronique', nom: 'Samsung Galaxy A54 reconditionné', vendeur: 'Tech Sénégal', prix: '180 000', ville: 'Dakar' },
    { emoji: '🎨', bg: 'linear-gradient(135deg,#1e1650,#2d1f7a)', categorie: 'Art', nom: 'Tableau peinture acrylique', vendeur: 'Moussa Coulibaly', prix: '45 000', ville: 'Abidjan' },
    { emoji: '🍎', bg: 'linear-gradient(135deg,#0f2a1e,#1a5c3a)', categorie: 'Alimentation', nom: 'Panier de fruits bio', vendeur: 'Bio Market', prix: '8 000', ville: 'Grenoble' },
    { emoji: '👟', bg: 'linear-gradient(135deg,#2a1a10,#7a3a10)', categorie: 'Chaussures', nom: 'Sneakers artisanales en cuir', vendeur: 'Fallou Créations', prix: '35 000', ville: 'Saint-Louis' },
    { emoji: '📚', bg: 'linear-gradient(135deg,#1a2030,#1a4060)', categorie: 'Livres', nom: 'Collection romans africains', vendeur: 'Librairie Afrique', prix: '12 000', ville: 'Paris' },
  ];
}