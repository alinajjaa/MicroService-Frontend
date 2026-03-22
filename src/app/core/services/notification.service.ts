import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationResponse {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private apiUrl =
    `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getMyNotifications(
    userId: string
  ): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getUnreadCount(
    userId: string
  ): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/unread/${userId}`
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/read`, {}
    );
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/user/${userId}/read-all`, {}
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}