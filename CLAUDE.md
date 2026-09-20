# KOFIS City - Règles pour l'agent

## Projet
Super-app "première ville virtuelle du monde". Chaque citoyen a un Passeport numérique et accède à des pôles d'activités (Éducation, Grand Marché, Musique...).
Ce dépôt contient uniquement le FRONTEND. Le backend (kofis-backend-pnpm) est dans un autre dépôt.

## Stack du frontend
- Angular 22, composants standalone, builder @angular/build
- Formulaires : FormsModule (template-driven) pour l'instant
- HTTP : HttpClient (provideHttpClient dans app.config.ts)
- Tests : ng test (Vitest + jsdom) — un .spec.ts existe pour chaque page, service, guard et composant partagé
- Déploiement : Vercel

## Structure
- src/app/pages/<page>/ : une page = un composant (.ts, .html, .css, .spec.ts)
- src/app/services/ : services (AuthService, MessagerieService)
- src/app/guards/ : guards de routes (authGuard)
- src/app/shared/ : composants réutilisés entre pages (navbar)
- src/app/app.routes.ts : routes ; src/app/app.config.ts : configuration (provideRouter, provideHttpClient)

## Pages
- accueil : page publique d'entrée, présentation de KOFIS City
- inscription : formulaire d'inscription, appelle AuthService.inscrire
- connexion : formulaire de connexion, appelle AuthService.connecter
- dashboard (protégée par authGuard) : passeport numérique du citoyen, lit `kofis_user` dans localStorage, télécharge le PDF via AuthService.telechargerPasseport
- pole-education, pole-marche, pole-musique : vitrines de pôles (cours, produits, artistes), données statiques dans le composant pour l'instant, pas encore branchées à une API
- messagerie (protégée par authGuard) : conversations via MessagerieService, menu de choix du moyen de paiement (Wave, Orange Money, carte bancaire) — l'envoi de paiement n'est pas encore implémenté côté backend

## Services
- AuthService (src/app/services/auth.ts) : inscription, connexion, téléchargement du passeport (blob) ; gère le token via localStorage (clé `kofis_token`)
- MessagerieService (src/app/services/messagerie.ts) : conversations et contacts actuellement mockés en mémoire (le backend n'expose pas encore de routes de messagerie) ; pensé pour être remplacé par de vrais appels HttpClient sans changer les composants consommateurs

## Gestion de l'URL de l'API
- Il n'y a pas encore de fichiers d'environnement (`src/environments/`) ni de `fileReplacements` dans angular.json.
- L'URL de l'API est actuellement écrite en dur dans AuthService (`https://kofis-backend-pnpm.onrender.com/api/...`) : même en développement local, le frontend appelle le backend de production déployé, pas une URL locale.
- Ceci ne respecte pas la règle "pas d'URL en dur" ci-dessous : c'est une dette existante à corriger via un fichier d'environnement, pas un modèle à reproduire pour du nouveau code.

## Commandes
- npm start : serveur de développement (ng serve, http://localhost:4200)
- npm run build : compilation
- npm test : tests unitaires
Avant chaque PR, npm run build et npm test doivent passer.

## Règles
- Travaille toujours sur une nouvelle branche, jamais sur main. Ouvre une PR avec un résumé clair en français.
- Petites PR : une fonctionnalité ou un correctif à la fois.
- Ajoute ou mets à jour les tests pour chaque changement.
- Pas de type any : définis des interfaces TypeScript pour les échanges avec l'API.
- L'URL de l'API ne s'écrit jamais en dur : utilise un fichier d'environnement.
- Ne modifie JAMAIS sans demande explicite : l'authentification (AuthService, stockage du token) et les paiements (Wave, Orange Money, Stripe).
- Ne mets jamais de secret, mot de passe, token ou clé dans le code ni dans les logs.
- Si une demande est ambiguë ou touche à la sécurité, pose la question dans la PR au lieu de deviner.
- Respecte les conventions du code existant : noms français pour les pages et les méthodes métier (inscription, inscrire), commentaires en français.
