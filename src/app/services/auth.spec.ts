import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth';
import { environment } from '../../environments/environment';

interface DonneesInscription {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  ville: string;
  pole: string;
}

interface DonneesConnexion {
  email: string;
  password: string;
}

interface UtilisateurReponse {
  prenom: string;
  nom: string;
  email: string;
}

interface ReponseAuth {
  token: string;
  user: UtilisateurReponse;
}

const URL_INSCRIPTION = `${environment.apiUrl}/inscription`;
const URL_CONNEXION = `${environment.apiUrl}/connexion`;
const URL_TELECHARGEMENT = 'https://kofis-backend-pnpm.onrender.com/api/passeport/telecharger';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('inscrire', () => {
    it("envoie une requête POST à l'URL d'inscription et transmet la réponse en cas de succès", () => {
      const donnees: DonneesInscription = {
        prenom: 'Khoyane',
        nom: 'Dramé',
        email: 'khoyane@kofis.city',
        password: 'secret123',
        ville: 'Dakar',
        pole: 'education'
      };
      const reponseAttendue: ReponseAuth = {
        token: 'jwt-token',
        user: { prenom: 'Khoyane', nom: 'Dramé', email: 'khoyane@kofis.city' }
      };
      let reponseRecue: ReponseAuth | undefined;

      service.inscrire(donnees).subscribe(res => (reponseRecue = res as ReponseAuth));

      const requete = httpMock.expectOne(URL_INSCRIPTION);
      expect(requete.request.method).toBe('POST');
      expect(requete.request.body).toEqual(donnees);
      requete.flush(reponseAttendue);

      expect(reponseRecue).toEqual(reponseAttendue);
    });

    it("transmet l'erreur HTTP en cas d'échec de l'inscription", () => {
      const donnees: DonneesInscription = {
        prenom: 'Khoyane',
        nom: 'Dramé',
        email: 'khoyane@kofis.city',
        password: 'secret123',
        ville: 'Dakar',
        pole: 'education'
      };
      let erreurRecue: HttpErrorResponse | undefined;
      let succes = false;

      service.inscrire(donnees).subscribe({
        next: () => (succes = true),
        error: (err: HttpErrorResponse) => (erreurRecue = err)
      });

      const requete = httpMock.expectOne(URL_INSCRIPTION);
      requete.flush({ message: 'Email déjà utilisé.' }, { status: 409, statusText: 'Conflict' });

      expect(succes).toBe(false);
      expect(erreurRecue?.status).toBe(409);
      expect(erreurRecue?.error.message).toBe('Email déjà utilisé.');
    });
  });

  describe('connecter', () => {
    it("envoie une requête POST à l'URL de connexion et transmet la réponse en cas de succès", () => {
      const donnees: DonneesConnexion = { email: 'khoyane@kofis.city', password: 'secret123' };
      const reponseAttendue: ReponseAuth = {
        token: 'jwt-token',
        user: { prenom: 'Khoyane', nom: 'Dramé', email: 'khoyane@kofis.city' }
      };
      let reponseRecue: ReponseAuth | undefined;

      service.connecter(donnees).subscribe(res => (reponseRecue = res as ReponseAuth));

      const requete = httpMock.expectOne(URL_CONNEXION);
      expect(requete.request.method).toBe('POST');
      expect(requete.request.body).toEqual(donnees);
      requete.flush(reponseAttendue);

      expect(reponseRecue).toEqual(reponseAttendue);
    });

    it("transmet l'erreur HTTP en cas d'échec de la connexion", () => {
      const donnees: DonneesConnexion = { email: 'khoyane@kofis.city', password: 'mauvais-mdp' };
      let erreurRecue: HttpErrorResponse | undefined;
      let succes = false;

      service.connecter(donnees).subscribe({
        next: () => (succes = true),
        error: (err: HttpErrorResponse) => (erreurRecue = err)
      });

      const requete = httpMock.expectOne(URL_CONNEXION);
      requete.flush({ message: 'Email ou mot de passe incorrect.' }, { status: 401, statusText: 'Unauthorized' });

      expect(succes).toBe(false);
      expect(erreurRecue?.status).toBe(401);
      expect(erreurRecue?.error.message).toBe('Email ou mot de passe incorrect.');
    });
  });

  describe('telechargerPasseport', () => {
    it("envoie une requête GET avec le token du localStorage en en-tête Authorization et un responseType blob", () => {
      localStorage.setItem('kofis_token', 'jwt-token');
      let blobRecu: Blob | undefined;

      service.telechargerPasseport().subscribe(blob => (blobRecu = blob as Blob));

      const requete = httpMock.expectOne(URL_TELECHARGEMENT);
      expect(requete.request.method).toBe('GET');
      expect(requete.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      expect(requete.request.responseType).toBe('blob');

      const blobSimule = new Blob(['contenu pdf'], { type: 'application/pdf' });
      requete.flush(blobSimule);

      expect(blobRecu).toBeTruthy();
    });

    it("transmet l'erreur en cas d'échec du téléchargement", () => {
      localStorage.setItem('kofis_token', 'jwt-token');
      let erreurRecue: HttpErrorResponse | undefined;
      let succes = false;

      service.telechargerPasseport().subscribe({
        next: () => (succes = true),
        error: (err: HttpErrorResponse) => (erreurRecue = err)
      });

      const requete = httpMock.expectOne(URL_TELECHARGEMENT);
      requete.flush(new Blob(), { status: 500, statusText: 'Server Error' });

      expect(succes).toBe(false);
      expect(erreurRecue?.status).toBe(500);
    });
  });
});
