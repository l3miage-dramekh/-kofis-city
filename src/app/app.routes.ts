import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Inscription } from './pages/inscription/inscription';
import { Dashboard } from './pages/dashboard/dashboard';
import { PoleEducation } from './pages/pole-education/pole-education';
import { Connexion } from './pages/connexion/connexion';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'inscription', component: Inscription },
  { path: 'dashboard', component: Dashboard },
  { path: 'education', component: PoleEducation },
  { path: 'connexion', component: Connexion },
  { path: '**', redirectTo: '' }
];