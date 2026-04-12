import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationService,
  NotificationResponse
} from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent implements OnInit {

  notifications: NotificationResponse[] = [];
  filteredNotifications: NotificationResponse[] = [];
  unreadCount = 0;
  loading = false;
  activeTab: 'all' | 'unread' = 'all';

  private userId = '';

  constructor(
    private notifService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user?.keycloakId || '';
    this.load();
  }

  load(): void {
    if (!this.userId) return;
    this.loading = true;
    this.notifService.getMyNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.unreadCount = data.filter(n => !n.read).length;
        this.applyTab();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyTab(): void {
    this.filteredNotifications = this.activeTab === 'unread'
      ? this.notifications.filter(n => !n.read)
      : this.notifications;
  }

  markAsRead(notif: NotificationResponse): void {
    if (notif.read) return;
    this.notifService.markAsRead(notif.id).subscribe({
      next: () => {
        notif.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.applyTab();
      }
    });
  }

  markAllAsRead(): void {
    this.notifService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.applyTab();
      }
    });
  }

  delete(id: number): void {
    this.notifService.deleteNotification(id).subscribe({
      next: () => {
        const removed = this.notifications.find(n => n.id === id);
        if (removed && !removed.read) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.applyTab();
      }
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      EVENT_CREATED:          '📅',
      EVENT_REGISTERED:       '✅',
      EVENT_STATUS_CHANGED:   '🔄',
      COMPLAINT_CREATED:      '📢',
      COMPLAINT_STATUS_CHANGED: '🔔',
      MOOD_ALERT:             '💛',
      MESSAGE:                '💬',
      REMINDER:               '⏰',
      INFO:                   'ℹ️',
      WARNING:                '⚠️',
      SUCCESS:                '✅',
      ERROR:                  '❌'
    };
    return icons[type] ?? '🔔';
  }
}
