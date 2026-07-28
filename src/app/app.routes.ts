import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Inscription } from './pages/inscription/inscription';
import { Dashboard } from './pages/dashboard/dashboard';
import { PoleEducation } from './pages/pole-education/pole-education';
import { Connexion } from './pages/connexion/connexion';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'inscription', component: Inscription },
  { path: 'connexion', component: Connexion },
  { path: 'education', component: PoleEducation },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];