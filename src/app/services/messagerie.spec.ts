import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MessagerieService } from './messagerie';

describe('MessagerieService', () => {
  let service: MessagerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('retourne la liste des conversations', async () => {
    const conversations = await firstValueFrom(service.getConversations());
    expect(conversations.length).toBeGreaterThan(0);
  });

  it('ajoute un message envoyé à la conversation ciblée', async () => {
    const conversations = await firstValueFrom(service.getConversations());
    const conversationId = conversations[0].id;
    const nbAvant = conversations[0].messages.length;

    const message = await firstValueFrom(service.envoyerMessage(conversationId, 'Salut !'));

    expect(message.texte).toBe('Salut !');
    expect(conversations[0].messages.length).toBe(nbAvant + 1);
  });
});
