import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Conversation, ContactDisponible, Message, MessagerieService } from '../../services/messagerie';

@Component({
  selector: 'app-messagerie',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './messagerie.html',
  styleUrl: './messagerie.css'
})
export class Messagerie implements OnInit, AfterViewChecked {
  @ViewChild('zoneMessages') zoneMessages?: ElementRef<HTMLDivElement>;

  conversations: Conversation[] = [];
  contactsDisponibles: ContactDisponible[] = [];
  conversationActive: Conversation | undefined;
  nouveauMessage = '';
  recherche = '';
  chargement = true;
  afficherNouvelleConversation = false;

  private doitDeraouler = false;

  constructor(private messagerieService: MessagerieService) {}

  ngOnInit() {
    this.messagerieService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
      this.chargement = false;
      if (conversations.length) {
        this.selectionner(conversations[0]);
      }
    });
    this.messagerieService.getContactsDisponibles().subscribe(contacts => {
      this.contactsDisponibles = contacts;
    });
  }

  ngAfterViewChecked() {
    if (this.doitDeraouler) {
      this.deraouler();
      this.doitDeraouler = false;
    }
  }

  get conversationsFiltrees(): Conversation[] {
    const terme = this.recherche.trim().toLowerCase();
    if (!terme) {
      return this.conversations;
    }
    return this.conversations.filter(conversation =>
      conversation.nom.toLowerCase().includes(terme) ||
      (conversation.pole ?? '').toLowerCase().includes(terme)
    );
  }

  get nombreEnLigne(): number {
    return this.conversations.filter(c => c.enLigne).length;
  }

  selectionner(conversation: Conversation) {
    this.conversationActive = conversation;
    conversation.nonLus = 0;
    this.doitDeraouler = true;
  }

  envoyer() {
    const texte = this.nouveauMessage.trim();
    if (!texte || !this.conversationActive) {
      return;
    }
    const conversationId = this.conversationActive.id;
    this.messagerieService.envoyerMessage(conversationId, texte).subscribe(() => {
      this.nouveauMessage = '';
      this.doitDeraouler = true;
    });
  }

  basculerNouvelleConversation() {
    this.afficherNouvelleConversation = !this.afficherNouvelleConversation;
  }

  demarrerAvec(contact: ContactDisponible) {
    this.messagerieService.demarrerConversation(contact.id).subscribe(conversation => {
      if (!conversation) {
        return;
      }
      if (!this.conversations.some(c => c.id === conversation.id)) {
        this.conversations.unshift(conversation);
      }
      this.contactsDisponibles = this.contactsDisponibles.filter(c => c.id !== contact.id);
      this.selectionner(conversation);
      this.afficherNouvelleConversation = false;
    });
  }

  identifierMessage(index: number, message: Message): string {
    return message.id;
  }

  identifierConversation(index: number, conversation: Conversation): string {
    return conversation.id;
  }

  identifierContact(index: number, contact: ContactDisponible): string {
    return contact.id;
  }

  formaterPrix(montant: number): string {
    return `${montant.toLocaleString('fr-FR')} FCFA`;
  }

  // Libellé complet pour les lecteurs d'écran : le format en cercles
  // repose surtout sur les initiales visuellement, il faut donc que
  // l'aria-label porte toute l'info (nom, statut, non-lus).
  libelleConversation(conversation: Conversation): string {
    const statut = conversation.enLigne ? 'en ligne' : 'hors ligne';
    const nonLus = conversation.nonLus > 0
      ? `, ${conversation.nonLus} message${conversation.nonLus > 1 ? 's' : ''} non lu${conversation.nonLus > 1 ? 's' : ''}`
      : '';
    return `${conversation.nom}, ${statut}${nonLus}`;
  }

  libelleContact(contact: ContactDisponible): string {
    const statut = contact.enLigne ? 'en ligne' : 'hors ligne';
    return `Démarrer une conversation avec ${contact.nom}, ${contact.pole}, ${statut}`;
  }

  private deraouler() {
    const element = this.zoneMessages?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
