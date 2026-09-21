import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }]
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it("autorise l'accès quand un token est présent dans le localStorage", () => {
    localStorage.setItem('kofis_token', 'jwt-token');

    const resultat = executeGuard(route, state);

    expect(resultat).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("redirige vers /connexion quand aucun token n'est présent", () => {
    const resultat = executeGuard(route, state);

    expect(resultat).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/connexion']);
  });
});
