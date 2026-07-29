import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProduitPartage {
  nom: string;
  prix: number;
  quantite?: number;
}

export interface Message {
  id: string;
  expediteur: 'moi' | 'contact';
  type: 'texte' | 'produit';
  texte?: string;
  produit?: ProduitPartage;
  heure: string;
  lu: boolean;
}

export interface Conversation {
  id: string;
  nom: string;
  pole?: string;
  initiales: string;
  enLigne: boolean;
  dernierMessage: string;
  heure: string;
  nonLus: number;
  messages: Message[];
}

export interface ContactDisponible {
  id: string;
  nom: string;
  pole: string;
  initiales: string;
  enLigne: boolean;
}

/**
 * Service de messagerie KOFIS City.
 *
 * Pour l'instant les données sont mockées en mémoire (le backend
 * kofis-backend-pnpm n'expose pas encore de routes de messagerie).
 * Les méthodes retournent des Observable pour que le remplacement
 * par de vrais appels HttpClient (this.http.get/post(...)) se fasse
 * sans changer les composants qui consomment ce service.
 */
@Injectable({
  providedIn: 'root'
})
export class MessagerieService {
  private conversations: Conversation[] = [
    {
      id: 'moussa-ba',
      nom: 'Moussa Ba',
      pole: 'Grand Marché',
      initiales: 'MB',
      enLigne: true,
      dernierMessage: '28 500 F reçus ✓✓',
      heure: '14:32',
      nonLus: 0,
      messages: [
        { id: 'm1', expediteur: 'contact', type: 'texte', texte: "Bonjour ! J'ai reçu le casque, c'est parfait !", heure: '14:28', lu: true },
        { id: 'm2', expediteur: 'moi', type: 'texte', texte: 'Super ! Merci de votre confiance, Moussa.', heure: '14:29', lu: true },
        { id: 'm3', expediteur: 'contact', type: 'texte', texte: 'Je commande 3 autres pour mes amis. Prix groupé ?', heure: '14:30', lu: true },
        { id: 'm4', expediteur: 'moi', type: 'texte', texte: '-10% dès 3 unités = 76 950 FCFA les 3.', heure: '14:31', lu: true },
        { id: 'm5', expediteur: 'moi', type: 'produit', produit: { nom: 'Casque Bluetooth Pro', prix: 76950, quantite: 3 }, heure: '14:31', lu: true }
      ]
    },
    {
      id: 'recruteur-techco',
      nom: 'Recruteur TechCo',
      pole: 'Zone Travail',
      initiales: 'RK',
      enLigne: false,
      dernierMessage: 'Votre profil...',
      heure: 'Hier',
      nonLus: 1,
      messages: [
        { id: 'm1', expediteur: 'contact', type: 'texte', texte: 'Votre profil correspond à une offre chez nous, intéressé ?', heure: 'Hier', lu: false }
      ]
    },
    {
      id: 'prof-soukeye',
      nom: 'Prof. Soukeye',
      pole: 'Éducation',
      initiales: 'SK',
      enLigne: false,
      dernierMessage: 'Exercice S6 dispo',
      heure: 'Lundi',
      nonLus: 0,
      messages: [
        { id: 'm1', expediteur: 'contact', type: 'texte', texte: "L'exercice de la séance 6 est disponible.", heure: 'Lundi', lu: true }
      ]
    },
    {
      id: 'groupe-marche',
      nom: 'Groupe Marché',
      pole: 'Grand Marché',
      initiales: 'GK',
      enLigne: false,
      dernierMessage: 'Merci Ibrahima !',
      heure: 'Hier',
      nonLus: 0,
      messages: [
        { id: 'm1', expediteur: 'contact', type: 'texte', texte: 'Merci Ibrahima !', heure: 'Hier', lu: true }
      ]
    }
  ];

  // Citoyens avec qui on peut démarrer une nouvelle conversation.
  // (dans une vraie implémentation, viendrait d'un endpoint /citoyens)
  private contactsDisponibles: ContactDisponible[] = [
    { id: 'aicha-ndiaye', nom: 'Aïcha Ndiaye', pole: 'Éducation', initiales: 'AN', enLigne: true },
    { id: 'boubacar-sy', nom: 'Boubacar Sy', pole: 'Tech & Innovation', initiales: 'BS', enLigne: false },
    { id: 'fatou-diop', nom: 'Fatou Diop', pole: 'Musique', initiales: 'FD', enLigne: true }
  ];

  getConversations(): Observable<Conversation[]> {
    return of(this.conversations);
  }

  getConversation(id: string): Observable<Conversation | undefined> {
    return this.getConversations().pipe(
      map(conversations => conversations.find(c => c.id === id))
    );
  }

  getContactsDisponibles(): Observable<ContactDisponible[]> {
    return of(this.contactsDisponibles);
  }

  // Crée une conversation vide avec un contact et le retire de la liste
  // des contacts disponibles (comme démarrer une vraie discussion).
  demarrerConversation(contactId: string): Observable<Conversation | undefined> {
    const contact = this.contactsDisponibles.find(c => c.id === contactId);
    if (!contact) {
      return of(undefined);
    }

    const dejaExistante = this.conversations.find(c => c.id === contact.id);
    if (dejaExistante) {
      return of(dejaExistante);
    }

    const nouvelleConversation: Conversation = {
      id: contact.id,
      nom: contact.nom,
      pole: contact.pole,
      initiales: contact.initiales,
      enLigne: contact.enLigne,
      dernierMessage: 'Nouvelle conversation',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      nonLus: 0,
      messages: []
    };

    this.conversations.unshift(nouvelleConversation);
    this.contactsDisponibles = this.contactsDisponibles.filter(c => c.id !== contactId);

    return of(nouvelleConversation);
  }

  envoyerMessage(conversationId: string, texte: string): Observable<Message> {
    const conversation = this.conversations.find(c => c.id === conversationId);
    const message: Message = {
      id: `m${Date.now()}`,
      expediteur: 'moi',
      type: 'texte',
      texte,
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: true
    };
    if (conversation) {
      conversation.messages.push(message);
      conversation.dernierMessage = texte;
      conversation.heure = message.heure;
    }
    return of(message);
  }
}
