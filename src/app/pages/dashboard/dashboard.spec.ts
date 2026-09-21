import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { routes } from '../../app.routes';

import { Dashboard } from './dashboard';

interface UtilisateurStocke {
  prenom: string;
  nom: string;
  ville: string;
  pole: string;
  email: string;
}

const URL_TELECHARGEMENT = 'https://kofis-backend-pnpm.onrender.com/api/passeport/telecharger';

const UTILISATEUR: UtilisateurStocke = {
  prenom: 'Khoyane',
  nom: 'Dramé',
  ville: 'Dakar',
  pole: 'education',
  email: 'khoyane@kofis.city'
};

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    localStorage.setItem('kofis_user', JSON.stringify(UTILISATEUR));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("redirige vers /inscription quand il n'y a pas de kofis_user dans le localStorage", async () => {
    localStorage.removeItem('kofis_user');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/inscription']);
    expect(component.prenom).toBe('');
  });

  // BUG confirmé : dashboard.ts:25 fait JSON.parse(data) sans try/catch.
  // Un kofis_user invalide dans le localStorage fait planter ngOnInit (SyntaxError non capturée).
  it.fails("ne plante pas et redirige vers /inscription quand kofis_user contient du JSON invalide", async () => {
    localStorage.setItem('kofis_user', '{invalide');

    expect(() => fixture.detectChanges()).not.toThrow();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/inscription']);
  });

  it("remplit les informations du citoyen à partir du kofis_user présent dans le localStorage", () => {
    localStorage.setItem('kofis_user', JSON.stringify(UTILISATEUR));

    fixture.detectChanges();

    expect(component.prenom).toBe('Khoyane');
    expect(component.nom).toBe('Dramé');
    expect(component.ville).toBe('Dakar');
    expect(component.pole).toBe('education');
    expect(component.email).toBe('khoyane@kofis.city');
    expect(component.initiales).toBe('KD');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("affiche un message de passeport prêt qui ne mentionne pas d'email envoyé", () => {
    localStorage.setItem('kofis_user', JSON.stringify(UTILISATEUR));

    fixture.detectChanges();

    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain('Ton Passeport KOFIS est prêt !');
    expect(texte).toContain('Télécharge-le dès maintenant avec le bouton ci-dessous.');
    expect(texte).not.toMatch(/email|boîte mail/i);
  });

  describe('telechargerPasseport', () => {
    beforeEach(() => {
      localStorage.setItem('kofis_user', JSON.stringify(UTILISATEUR));
      fixture.detectChanges();
    });

    it('télécharge le passeport avec succès et déclenche le téléchargement du fichier', () => {
      const urlSimulee = 'blob:http://localhost/fake-passeport';
      const creerUrlSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue(urlSimulee);
      const revoquerUrlSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
      const clicSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      component.telechargerPasseport();

      const requete = httpMock.expectOne(URL_TELECHARGEMENT);
      expect(requete.request.method).toBe('GET');
      const blobSimule = new Blob(['contenu pdf'], { type: 'application/pdf' });
      requete.flush(blobSimule);

      expect(creerUrlSpy).toHaveBeenCalledWith(blobSimule);
      expect(clicSpy).toHaveBeenCalled();
      expect(revoquerUrlSpy).toHaveBeenCalledWith(urlSimulee);

      creerUrlSpy.mockRestore();
      revoquerUrlSpy.mockRestore();
      clicSpy.mockRestore();
    });

    it("journalise une erreur dans la console en cas d'échec du téléchargement", () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.telechargerPasseport();

      const requete = httpMock.expectOne(URL_TELECHARGEMENT);
      requete.flush(new Blob(), { status: 500, statusText: 'Server Error' });

      expect(consoleSpy).toHaveBeenCalledWith('Erreur téléchargement', expect.anything());

      consoleSpy.mockRestore();
    });
  });
});
