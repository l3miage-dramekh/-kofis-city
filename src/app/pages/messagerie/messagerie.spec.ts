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
});
