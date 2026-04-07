import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ChatService, MessageResponse } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  isOpen = false;
  message = '';
  messages: MessageResponse[] = [];
  loading = false;
  user: any;
  conversationId: string | null = null;
  showChatbot = false;

  readonly AI_ID = 'ai-assistant';
  readonly AI_NAME = '🤖 Assistant Bien-être';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.checkRoute(this.router.url);

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.user = this.authService.getUser();
      this.checkRoute(e.urlAfterRedirects || e.url);
    });
  }

  checkRoute(url: string): void {
    const hiddenRoutes = ['/login', '/register'];
    this.showChatbot = !hiddenRoutes.some(r => url.startsWith(r)) && !!this.user;
    if (!this.showChatbot) this.isOpen = false;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.conversationId && this.user) {
      this.startConversation();
    }
  }

  startConversation(): void {
    this.chatService.startConversation(
      this.user.keycloakId, this.AI_ID,
      this.user.firstName + ' ' + this.user.lastName,
      this.AI_NAME
    ).subscribe({
      next: (conv) => {
        this.conversationId = conv.id;
        this.loadMessages();
      },
      error: () => {
        this.messages = [{
          id: '0', conversationId: '', senderId: this.AI_ID,
          senderName: this.AI_NAME, senderEmail: '', receiverId: '',
          content: 'Bienvenue ! Comment puis-je vous aider ? 😊',
          type: 'TEXT', read: true, deleted: false,
          createdAt: new Date().toISOString()
        }];
      }
    });
  }

  loadMessages(): void {
    if (!this.conversationId || !this.user) return;
    this.chatService.getMessages(this.conversationId, this.user.keycloakId)
      .subscribe({
        next: (msgs) => {
          this.messages = msgs;
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });
  }

  send(): void {
    if (!this.message.trim() || !this.user || this.loading) return;

    const content = this.message.trim();
    this.message = '';
    this.loading = true;

    this.messages.push({
      id: Date.now().toString(), conversationId: this.conversationId || '',
      senderId: this.user.keycloakId,
      senderName: this.user.firstName + ' ' + this.user.lastName,
      senderEmail: this.user.email, receiverId: this.AI_ID,
      content, type: 'TEXT', read: true, deleted: false,
      createdAt: new Date().toISOString()
    });
    this.scrollToBottom();

    this.chatService.sendMessage({
      senderId: this.user.keycloakId,
      senderName: this.user.firstName + ' ' + this.user.lastName,
      senderEmail: this.user.email,
      receiverId: this.AI_ID,
      receiverName: this.AI_NAME,
      content
    }).subscribe({
      next: () => {
        setTimeout(() => {
          this.loadMessages();
          this.loading = false;
        }, 2000);
      },
      error: () => {
        this.messages.push({
          id: Date.now().toString(), conversationId: '',
          senderId: this.AI_ID, senderName: this.AI_NAME,
          senderEmail: '', receiverId: this.user.keycloakId,
          content: 'Désolé, une erreur est survenue. Réessayez. 🙏',
          type: 'TEXT', read: true, deleted: false,
          createdAt: new Date().toISOString()
        });
        this.loading = false;
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chatbot-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  isMyMessage(msg: MessageResponse): boolean {
    return msg.senderId !== this.AI_ID;
  }
}