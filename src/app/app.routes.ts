import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Inscription } from './pages/inscription/inscription';
import { Dashboard } from './pages/dashboard/dashboard';
import { PoleEducation } from './pages/pole-education/pole-education';
import { Connexion } from './pages/connexion/connexion';
import { PoleMarche } from './pages/pole-marche/pole-marche';
import { PoleMusique } from './pages/pole-musique/pole-musique';
import { Messagerie } from './pages/messagerie/messagerie';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'inscription', component: Inscription },
  { path: 'connexion', component: Connexion },
  { path: 'education', component: PoleEducation },
  { path: 'marche', component: PoleMarche },
  { path: 'musique', component: PoleMusique },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'messagerie', component: Messagerie, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];