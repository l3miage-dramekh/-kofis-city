import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Conversation, MessagerieService, ProduitPartage } from '../../services/messagerie';

@Component({
  selector: 'app-messagerie',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './messagerie.html',
  styleUrl: './messagerie.css'
})
export class Messagerie implements OnInit {
  conversations: Conversation[] = [];
  conversationActive: Conversation | undefined;
  nouveauMessage = '';
  chargement = true;
  noteInfo = '';

  constructor(private messagerieService: MessagerieService) {}

  ngOnInit() {
    this.messagerieService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
      this.chargement = false;
      if (conversations.length) {
        this.selectionner(conversations[0]);
      }
    });
  }

  selectionner(conversation: Conversation) {
    this.conversationActive = conversation;
    conversation.nonLus = 0;
  }

  envoyer() {
    const texte = this.nouveauMessage.trim();
    if (!texte || !this.conversationActive) {
      return;
    }
    const conversationId = this.conversationActive.id;
    this.messagerieService.envoyerMessage(conversationId, texte).subscribe(() => {
      this.nouveauMessage = '';
    });
  }

  payerWave(produit: ProduitPartage) {
    this.noteInfo = `Paiement Wave de ${produit.prix.toLocaleString('fr-FR')} FCFA — fonctionnalité à venir (nécessite l'intégration Wave côté backend).`;
    setTimeout(() => (this.noteInfo = ''), 4000);
  }

  formaterPrix(montant: number): string {
    return `${montant.toLocaleString('fr-FR')} FCFA`;
  }
}
