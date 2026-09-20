import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Inscription } from './inscription';

interface UtilisateurReponse {
  prenom: string;
  nom: string;
  email: string;
}

const URL_INSCRIPTION = 'https://kofis-backend-pnpm.onrender.com/api/auth/inscription';

describe('Inscription', () => {
  let component: Inscription;
  let fixture: ComponentFixture<Inscription>;
  let httpMock: HttpTestingController;
  let router: Router;

  function remplirFormulaireValide() {
    component.prenom = 'Khoyane';
    component.nom = 'Dramé';
    component.email = 'khoyane@kofis.city';
    component.password = 'secret123';
    component.confirmPassword = 'secret123';
    component.ville = 'Dakar';
    component.pole = 'education';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscription],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Inscription);
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

  it("affiche une erreur et n'appelle pas le backend si un champ obligatoire manque", () => {
    remplirFormulaireValide();
    component.prenom = '';

    component.inscrire();

    expect(component.erreur).toBe('Merci de remplir tous les champs obligatoires.');
    httpMock.expectNone(URL_INSCRIPTION);
  });

  it("affiche une erreur si les mots de passe ne correspondent pas", () => {
    remplirFormulaireValide();
    component.confirmPassword = 'autre-mdp';

    component.inscrire();

    expect(component.erreur).toBe('Les mots de passe ne correspondent pas.');
    httpMock.expectNone(URL_INSCRIPTION);
  });

  it('affiche une erreur si le mot de passe fait moins de 6 caractères', () => {
    remplirFormulaireValide();
    component.password = '123';
    component.confirmPassword = '123';

    component.inscrire();

    expect(component.erreur).toBe('Le mot de passe doit contenir au moins 6 caractères.');
    httpMock.expectNone(URL_INSCRIPTION);
  });

  it("en cas de succès, stocke le token et l'utilisateur puis redirige vers le dashboard", () => {
    remplirFormulaireValide();

    component.inscrire();

    expect(component.chargement).toBe(true);

    const requete = httpMock.expectOne(URL_INSCRIPTION);
    expect(requete.request.method).toBe('POST');
    expect(requete.request.body).toEqual({
      prenom: 'Khoyane',
      nom: 'Dramé',
      email: 'khoyane@kofis.city',
      password: 'secret123',
      ville: 'Dakar',
      pole: 'education'
    });

    const utilisateur: UtilisateurReponse = { prenom: 'Khoyane', nom: 'Dramé', email: 'khoyane@kofis.city' };
    requete.flush({ token: 'jwt-token', user: utilisateur });

    expect(localStorage.getItem('kofis_token')).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('kofis_user') ?? '{}')).toEqual(utilisateur);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // BUG confirmé : inscription.ts:57-59 stocke et redirige sans vérifier que res.token existe.
  // Si le backend renvoie une réponse 200 sans champ token, "kofis_token" est quand même
  // écrit (valeur "undefined") et l'utilisateur est redirigé vers /dashboard.
  it.fails("ne stocke pas de token et ne redirige pas si la réponse du backend n'a pas de champ token", () => {
    remplirFormulaireValide();

    component.inscrire();

    const requete = httpMock.expectOne(URL_INSCRIPTION);
    const utilisateur: UtilisateurReponse = { prenom: 'Khoyane', nom: 'Dramé', email: 'khoyane@kofis.city' };
    requete.flush({ user: utilisateur } as unknown as { token: string; user: UtilisateurReponse });

    expect(localStorage.getItem('kofis_token')).toBeNull();
    expect(router.navigate).not.toHaveBeenCalledWith(['/dashboard']);
  });

  it('affiche un message dédié quand le serveur est injoignable (status 0)', () => {
    remplirFormulaireValide();

    component.inscrire();

    const requete = httpMock.expectOne(URL_INSCRIPTION);
    requete.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(component.erreur).toBe(
      'Impossible de contacter le serveur. Il est peut-être en train de démarrer, réessaie dans quelques secondes.'
    );
    expect(component.chargement).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("affiche le message d'erreur renvoyé par le backend", () => {
    remplirFormulaireValide();

    component.inscrire();

    const requete = httpMock.expectOne(URL_INSCRIPTION);
    requete.flush({ message: 'Email déjà utilisé.' }, { status: 409, statusText: 'Conflict' });

    expect(component.erreur).toBe('Email déjà utilisé.');
    expect(component.chargement).toBe(false);
  });

  it("affiche un message générique si le backend ne renvoie pas de message d'erreur", () => {
    remplirFormulaireValide();

    component.inscrire();

    const requete = httpMock.expectOne(URL_INSCRIPTION);
    requete.flush(null, { status: 409, statusText: 'Conflict' });

    expect(component.erreur).toBe('Une erreur est survenue.');
  });
});
