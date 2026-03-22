import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SendMessageRequest {
  receiverId: string;
  receiverName: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  type?: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  content: string;
  type: string;
  read: boolean;
  deleted: boolean;
  createdAt: string;
}

export interface ConversationResponse {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageSenderId: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
  otherUserId: string;
  otherUserName: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {

  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  // ✅ Envoyer un message
  sendMessage(
    data: SendMessageRequest
  ): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiUrl}/send`, data
    );
  }

  // ✅ Mes conversations
  getMyConversations(
    userId: string
  ): Observable<ConversationResponse[]> {
    return this.http.get<ConversationResponse[]>(
      `${this.apiUrl}/conversations/${userId}`
    );
  }

  // ✅ Messages d'une conversation
  getMessages(
    conversationId: string,
    userId: string
  ): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(
      `${this.apiUrl}/conversation/${conversationId}/user/${userId}`
    );
  }

  // ✅ Démarrer une conversation
  startConversation(
    userId1: string,
    userId2: string,
    user1Name: string,
    user2Name: string
  ): Observable<ConversationResponse> {
    return this.http.post<ConversationResponse>(
      `${this.apiUrl}/conversation/start`,
      { userId1, userId2, user1Name, user2Name }
    );
  }

  // ✅ Supprimer un message
  deleteMessage(
    messageId: string,
    userId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${messageId}/user/${userId}`
    );
  }

  // ✅ Messages non lus
  getUnreadCount(
    userId: string
  ): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/unread/${userId}`
    );
  }

  // ✅ Tous les users (pour chercher)
getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.apiUrl}/users/list`
  );
}
}