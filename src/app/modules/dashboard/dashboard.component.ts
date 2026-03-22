import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;

  cards = [
    {
      icon: '😊',
      title: 'Humeur',
      description: 'Suivez votre humeur quotidienne',
      path: '/home/moods',
      color: '#e8f5e9'
    },
    {
      icon: '🧘',
      title: 'Méditation',
      description: 'Sessions de méditation guidée',
      path: '/home/meditations',
      color: '#e3f2fd'
    },
    {
      icon: '📚',
      title: 'Ressources',
      description: 'Articles, vidéos et podcasts',
      path: '/home/resources',
      color: '#fff3e0'
    },
    {
      icon: '📅',
      title: 'Événements',
      description: 'Activités bien-être',
      path: '/home/events',
      color: '#fce4ec'
    },
    {
      icon: '💬',
      title: 'Chat',
      description: 'Messagerie avec les experts',
      path: '/home/chat',
      color: '#e8eaf6'
    },
    {
      icon: '📢',
      title: 'Réclamations',
      description: 'Soumettre une réclamation',
      path: '/home/complaints',
      color: '#f3e5f5'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }
}