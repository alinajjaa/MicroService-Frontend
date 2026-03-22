import { Component, OnInit, OnDestroy,
         ViewChild, ElementRef,
         AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChatService,
  ConversationResponse,
  MessageResponse
} from '../../../core/services/chat.service';
import { AuthService } from
  '../../../core/services/auth.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent
  implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesEnd')
  messagesEnd!: ElementRef;

  user: any;
  conversations: ConversationResponse[] = [];
  filteredConversations: ConversationResponse[] = [];
  selectedConversation: ConversationResponse | null = null;
  messages: MessageResponse[] = [];
  newMessage = '';
  searchTerm = '';
  loading = false;
  loadingMessages = false;
  error = '';
  showNewChat = false;
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  userSearch = '';
  private refreshInterval: any;
  private shouldScroll = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    // ✅ Charger users d'abord puis conversations
    this.loadAllUsers();
    setTimeout(() => {
      this.loadConversations();
    }, 500);

    // ✅ Rafraîchir toutes les 5 secondes
    this.refreshInterval = setInterval(() => {
      if (this.selectedConversation) {
        this.refreshMessages();
      }
      this.loadConversations();
    }, 5000);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadConversations(): void {
    this.chatService.getMyConversations(
      this.user.keycloakId
    ).subscribe({
      next: (data) => {
        // ✅ Enrichir avec les noms depuis allUsers
        this.conversations = data.map(conv => {
          if (!conv.otherUserName ||
              conv.otherUserName === 'Utilisateur') {
            const found = this.allUsers.find(
              u => u.keycloakId === conv.otherUserId
            );
            if (found) {
              conv.otherUserName =
                `${found.firstName} ${found.lastName}`;
            }
          }
          return conv;
        });
        this.applySearch();
      },
      error: () => {}
    });
  }

  applySearch(): void {
    this.filteredConversations = this.conversations.filter(c =>
      !this.searchTerm ||
      c.otherUserName?.toLowerCase().includes(
        this.searchTerm.toLowerCase())
    );
  }

  selectConversation(conv: ConversationResponse): void {
    this.selectedConversation = conv;
    this.loadMessages(conv.id);
  }

  loadMessages(conversationId: string): void {
    this.loadingMessages = true;
    this.chatService.getMessages(
      conversationId, this.user.keycloakId
    ).subscribe({
      next: (data) => {
        this.messages = data;
        this.loadingMessages = false;
        this.shouldScroll = true;
        this.loadConversations();
      },
      error: () => { this.loadingMessages = false; }
    });
  }

  refreshMessages(): void {
    if (!this.selectedConversation) return;
    this.chatService.getMessages(
      this.selectedConversation.id,
      this.user.keycloakId
    ).subscribe({
      next: (data) => {
        if (data.length !== this.messages.length) {
          this.messages = data;
          this.shouldScroll = true;
        }
      },
      error: () => {}
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() ||
        !this.selectedConversation) return;

    const other = this.selectedConversation.otherUserId;
    const data = {
      receiverId:   other,
      receiverName: this.selectedConversation.otherUserName,
      senderId:     this.user.keycloakId,
      senderName:
        `${this.user.firstName} ${this.user.lastName}`,
      senderEmail:  this.user.email,
      content:      this.newMessage.trim(),
      type:         'TEXT'
    };

    const content = this.newMessage;
    this.newMessage = '';

    this.chatService.sendMessage(data).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.shouldScroll = true;
        this.loadConversations();
      },
      error: () => {
        this.newMessage = content;
        this.error = 'Erreur envoi message';
      }
    });
  }

  deleteMessage(messageId: string): void {
    this.chatService.deleteMessage(
      messageId, this.user.keycloakId
    ).subscribe({
      next: () => {
        const msg = this.messages.find(
          m => m.id === messageId
        );
        if (msg) {
          msg.content = 'Message supprimé';
          msg.deleted = true;
        }
      },
      error: () => {}
    });
  }

  loadAllUsers(): void {
    this.chatService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data.filter(
          u => u.keycloakId !== this.user.keycloakId
        );
        this.filteredUsers = this.allUsers;
      },
      error: () => {}
    });
  }

  searchUsers(): void {
    this.filteredUsers = this.allUsers.filter(u =>
      u.firstName?.toLowerCase().includes(
        this.userSearch.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(
        this.userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(
        this.userSearch.toLowerCase())
    );
  }

  startNewChat(otherUser: any): void {
    const myName =
      `${this.user.firstName} ${this.user.lastName}`;
    const otherName =
      `${otherUser.firstName} ${otherUser.lastName}`;

    this.chatService.startConversation(
      this.user.keycloakId,
      otherUser.keycloakId,
      myName,
      otherName
    ).subscribe({
      next: (conv) => {
        // ✅ Forcer le nom correct
        conv.otherUserName = otherName;
        conv.otherUserId   = otherUser.keycloakId;
        this.showNewChat = false;
        this.userSearch  = '';
        this.loadConversations();
        this.selectConversation(conv);
      },
      error: () =>
        this.error = 'Erreur création conversation'
    });
  }

  openNewChat(): void {
    this.showNewChat = true;
    this.loadAllUsers();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesEnd.nativeElement.scrollIntoView(
        { behavior: 'smooth' }
      );
    } catch {}
  }

  isMine(msg: MessageResponse): boolean {
    return msg.senderId === this.user.keycloakId;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // ✅ Couleur unique par utilisateur
  getAvatarColor(name: string): string {
    const colors = [
      'linear-gradient(135deg, #1a472a, #52b788)',
      'linear-gradient(135deg, #1565c0, #42a5f5)',
      'linear-gradient(135deg, #6a1b9a, #ab47bc)',
      'linear-gradient(135deg, #b71c1c, #ef5350)',
      'linear-gradient(135deg, #e65100, #ffa726)',
      'linear-gradient(135deg, #004d40, #26a69a)',
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  formatTime(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) {
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit'
      });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return d.toLocaleDateString('fr-FR', {
        weekday: 'short'
      });
    }
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit'
    });
  }

  get totalUnread(): number {
    return this.conversations.reduce(
      (sum, c) => sum + (c.unreadCount || 0), 0
    );
  }
}