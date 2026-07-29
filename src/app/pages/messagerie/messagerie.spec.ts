import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Messagerie } from './messagerie';

describe('Messagerie', () => {
  let component: Messagerie;
  let fixture: ComponentFixture<Messagerie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Messagerie],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Messagerie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge les conversations et sélectionne la première par défaut', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.conversations.length).toBeGreaterThan(0);
    expect(component.conversationActive).toBeTruthy();
    expect(component.conversationActive?.id).toBe(component.conversations[0].id);
  });

  it("n'envoie pas de message vide", async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.nouveauMessage = '   ';
    const messagesAvant = component.conversationActive?.messages.length ?? 0;
    component.envoyer();
    expect(component.conversationActive?.messages.length).toBe(messagesAvant);
  });

  it('filtre les conversations par nom via la recherche', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.conversationsFiltrees.length).toBe(component.conversations.length);

    component.recherche = 'Moussa';
    expect(component.conversationsFiltrees.length).toBe(1);
    expect(component.conversationsFiltrees[0].nom).toContain('Moussa');

    component.recherche = 'nom-qui-nexiste-pas';
    expect(component.conversationsFiltrees.length).toBe(0);
  });

  it('filtre aussi par nom de pôle', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.recherche = 'éducation';
    expect(component.conversationsFiltrees.length).toBeGreaterThan(0);
    expect(component.conversationsFiltrees.every(c => c.pole?.toLowerCase().includes('éducation'))).toBeTruthy();
  });

  it('le bouton Payer Wave est désactivé (paiement pas encore implémenté)', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const boutonPayer: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn-payer');
    expect(boutonPayer).toBeTruthy();
    expect(boutonPayer?.disabled).toBe(true);
  });

  it('charge les contacts disponibles pour démarrer une nouvelle conversation', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.contactsDisponibles.length).toBeGreaterThan(0);
  });

  it('démarre une nouvelle conversation avec un contact disponible et la sélectionne', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const nbConversationsAvant = component.conversations.length;
    const nbContactsAvant = component.contactsDisponibles.length;
    const contact = component.contactsDisponibles[0];

    component.demarrerAvec(contact);

    expect(component.conversations.length).toBe(nbConversationsAvant + 1);
    expect(component.contactsDisponibles.length).toBe(nbContactsAvant - 1);
    expect(component.conversationActive?.nom).toBe(contact.nom);
    expect(component.conversationActive?.messages.length).toBe(0);
  });

  it('calcule le nombre de contacts en ligne', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const enLigneAttendu = component.conversations.filter(c => c.enLigne).length;
    expect(component.nombreEnLigne).toBe(enLigneAttendu);
  });
});
