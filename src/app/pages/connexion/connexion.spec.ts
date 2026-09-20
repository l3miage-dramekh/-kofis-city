import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Connexion } from './connexion';

interface UtilisateurReponse {
  prenom: string;
  nom: string;
  email: string;
}

const URL_CONNEXION = 'https://kofis-backend-pnpm.onrender.com/api/auth/connexion';

describe('Connexion', () => {
  let component: Connexion;
  let fixture: ComponentFixture<Connexion>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connexion],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Connexion);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("affiche une erreur et n'appelle pas le backend si l'email est vide", () => {
    component.email = '';
    component.password = 'secret123';

    component.connecter();

    expect(component.erreur).toBe('Merci de remplir tous les champs.');
    httpMock.expectNone(URL_CONNEXION);
  });

  it("affiche une erreur et n'appelle pas le backend si le mot de passe est vide", () => {
    component.email = 'khoyane@kofis.city';
    component.password = '';

    component.connecter();

    expect(component.erreur).toBe('Merci de remplir tous les champs.');
    httpMock.expectNone(URL_CONNEXION);
  });

  it("en cas de succès, stocke le token et l'utilisateur puis redirige vers le dashboard", () => {
    component.email = 'khoyane@kofis.city';
    component.password = 'secret123';

    component.connecter();

    expect(component.chargement).toBe(true);

    const requete = httpMock.expectOne(URL_CONNEXION);
    expect(requete.request.method).toBe('POST');
    expect(requete.request.body).toEqual({ email: 'khoyane@kofis.city', password: 'secret123' });

    const utilisateur: UtilisateurReponse = { prenom: 'Khoyane', nom: 'Dramé', email: 'khoyane@kofis.city' };
    requete.flush({ token: 'jwt-token', user: utilisateur });

    expect(localStorage.getItem('kofis_token')).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('kofis_user') ?? '{}')).toEqual(utilisateur);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('affiche un message dédié quand le serveur est injoignable (status 0)', () => {
    component.email = 'khoyane@kofis.city';
    component.password = 'secret123';

    component.connecter();

    const requete = httpMock.expectOne(URL_CONNEXION);
    requete.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(component.erreur).toBe(
      'Impossible de contacter le serveur. Il est peut-être en train de démarrer, réessaie dans quelques secondes.'
    );
    expect(component.chargement).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("affiche le message d'erreur renvoyé par le backend", () => {
    component.email = 'khoyane@kofis.city';
    component.password = 'mauvais-mdp';

    component.connecter();

    const requete = httpMock.expectOne(URL_CONNEXION);
    requete.flush({ message: 'Email ou mot de passe incorrect.' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.erreur).toBe('Email ou mot de passe incorrect.');
    expect(component.chargement).toBe(false);
  });

  it("affiche un message générique si le backend ne renvoie pas de message d'erreur", () => {
    component.email = 'khoyane@kofis.city';
    component.password = 'mauvais-mdp';

    component.connecter();

    const requete = httpMock.expectOne(URL_CONNEXION);
    requete.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(component.erreur).toBe('Email ou mot de passe incorrect.');
  });
});
