import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('estConnecte', () => {
    it('retourne true quand kofis_token est présent dans le localStorage', () => {
      localStorage.setItem('kofis_token', 'jwt-token');

      expect(component.estConnecte()).toBe(true);
    });

    it("retourne false quand kofis_token n'est pas présent dans le localStorage", () => {
      localStorage.removeItem('kofis_token');

      expect(component.estConnecte()).toBe(false);
    });
  });

  describe('deconnecter', () => {
    it('supprime le token et le citoyen puis redirige vers / quand la confirmation est acceptée', () => {
      localStorage.setItem('kofis_token', 'jwt-token');
      localStorage.setItem('kofis_user', '{"prenom":"Khoyane"}');
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      component.deconnecter();

      expect(localStorage.getItem('kofis_token')).toBeNull();
      expect(localStorage.getItem('kofis_user')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('ne supprime rien et ne redirige pas quand la confirmation est refusée', () => {
      localStorage.setItem('kofis_token', 'jwt-token');
      localStorage.setItem('kofis_user', '{"prenom":"Khoyane"}');
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      component.deconnecter();

      expect(localStorage.getItem('kofis_token')).toBe('jwt-token');
      expect(localStorage.getItem('kofis_user')).toBe('{"prenom":"Khoyane"}');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
