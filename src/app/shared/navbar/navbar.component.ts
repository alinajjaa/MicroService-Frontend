import { Component, OnInit, OnDestroy,
         HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink,
         RouterLinkActive } from '@angular/router';
import { AuthService } from
  '../../core/services/auth.service';
import { NotificationService,
         NotificationResponse } from
  '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent
  implements OnInit, OnDestroy {

  user: any;
  menuOpen          = false;
  dropdownOpen      = false;
  showNotifications = false;

  // ✅ Notifications
  notifications: NotificationResponse[] = [];
  unreadCount = 0;
  private notifInterval: any;

  navItems = [
    { label: 'Accueil',      icon: '🏠',
      path: '/home' },
    { label: 'Humeur',       icon: '😊',
      path: '/home/moods' },
    { label: 'Méditation',   icon: '🧘',
      path: '/home/meditations' },
    { label: 'Ressources',   icon: '📚',
      path: '/home/resources' },
    { label: 'Événements',   icon: '📅',
      path: '/home/events' },
    { label: 'Chat',         icon: '💬',
      path: '/home/chat' },
    { label: 'Réclamations', icon: '📢',
      path: '/home/complaints' }
  ];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadNotifications();

    // ✅ Rafraîchir toutes les 10 secondes
    this.notifInterval = setInterval(() => {
      this.loadUnreadCount();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.notifInterval) {
      clearInterval(this.notifInterval);
    }
  }

  loadNotifications(): void {
    if (!this.user?.keycloakId) return;
    this.notificationService.getMyNotifications(
      this.user.keycloakId
    ).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount   = data.filter(
          n => !n.read
        ).length;
      },
      error: () => {}
    });
  }

  loadUnreadCount(): void {
    if (!this.user?.keycloakId) return;
    this.notificationService.getUnreadCount(
      this.user.keycloakId
    ).subscribe({
      next: (data) => this.unreadCount = data.count,
      error: () => {}
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.dropdownOpen      = false;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  markAsRead(notif: NotificationResponse): void {
    if (notif.read) return;
    this.notificationService.markAsRead(
      notif.id
    ).subscribe({
      next: () => {
        notif.read       = true;
        this.unreadCount = Math.max(
          0, this.unreadCount - 1
        );
      },
      error: () => {}
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(
      this.user.keycloakId
    ).subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: () => {}
    });
  }

  deleteNotification(
    id: number, event: Event
  ): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(
      id
    ).subscribe({
      next: () => {
        this.notifications =
          this.notifications.filter(n => n.id !== id);
        this.unreadCount =
          this.notifications.filter(
            n => !n.read
          ).length;
      },
      error: () => {}
    });
  }

  getNotifIcon(type: string): string {
    const icons: any = {
      CHAT:      '💬',
      EVENT:     '📅',
      COMPLAINT: '📢',
      DEFAULT:   '🔔'
    };
    return icons[type] || icons['DEFAULT'];
  }

  formatTime(date: string): string {
    if (!date) return '';
    const d    = new Date(date);
    const now  = new Date();
    const diff = now.getTime() - d.getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);

    if (mins  < 1)  return 'À l\'instant';
    if (mins  < 60) return `Il y a ${mins} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-trigger')) {
      this.dropdownOpen = false;
    }
    if (!target.closest('.notif-trigger')) {
      this.showNotifications = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}