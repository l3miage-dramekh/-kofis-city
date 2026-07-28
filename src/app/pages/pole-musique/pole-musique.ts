import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-pole-musique',
  imports: [Navbar, NgFor],
  templateUrl: './pole-musique.html',
  styleUrl: './pole-musique.css'
})
export class PoleMusique {
  artistes = [
    { emoji: '🎤', bg: 'linear-gradient(135deg,#2a1020,#6b1a3a)', nom: 'Aminata Soul', genre: 'Afrobeat', titre: 'Liberté', streams: '1.2M', ville: 'Dakar' },
    { emoji: '🎸', bg: 'linear-gradient(135deg,#1a1035,#3d2085)', nom: 'Kofi Beats', genre: 'Hip-Hop', titre: 'Street Dreams', streams: '890K', ville: 'Abidjan' },
    { emoji: '🎹', bg: 'linear-gradient(135deg,#1e1650,#2d1f7a)', nom: 'Soro Piano', genre: 'Jazz Africain', titre: 'Nuit de Bamako', streams: '540K', ville: 'Bamako' },
    { emoji: '🥁', bg: 'linear-gradient(135deg,#2a1a10,#7a3a10)', nom: 'Fallou Rhythm', genre: 'Mbalax', titre: 'Teranga', streams: '2.1M', ville: 'Saint-Louis' },
    { emoji: '🎻', bg: 'linear-gradient(135deg,#0f2a1e,#1a5c3a)', nom: 'Nadia Strings', genre: 'Fusion', titre: 'African Roots', streams: '320K', ville: 'Paris' },
    { emoji: '🎺', bg: 'linear-gradient(135deg,#1a2030,#1a4060)', nom: 'Jazz Conakry', genre: 'Jazz', titre: 'Guinée Dorée', streams: '180K', ville: 'Conakry' },
  ];
}