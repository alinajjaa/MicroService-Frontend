import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user: any;
  collapsed = false;

menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
      exact: true
    },
    {
      label: 'Utilisateurs',
      icon: '👥',
      path: '/admin/users'
    },
    {
      label: 'Humeurs',
      icon: '😊',
      path: '/admin/moods'
    },
    // ✅ NOUVEAU
    {
      label: 'Méditations',
      icon: '🧘',
      path: '/admin/meditations'
    },
    {
      label: 'Événements',
      icon: '📅',
      path: '/admin/events'
    },
    {
      label: 'Ressources',
      icon: '📚',
      path: '/admin/resources'
    },
    {
      label: 'Réclamations',
      icon: '📢',
      path: '/admin/complaints'
    },
    {
      label: 'Chat',
      icon: '💬',
      path: '/admin/chat'
    }
  ];
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFrontoffice(): void {
    this.router.navigate(['/home']);
  }
}
