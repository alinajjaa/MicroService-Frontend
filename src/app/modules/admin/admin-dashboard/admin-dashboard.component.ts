import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MoodService } from '../../../core/services/mood.service';
import { EventService } from '../../../core/services/event.service';
import { ResourceService } from '../../../core/services/resource.service';
import { ComplaintService } from '../../../core/services/complaint.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  user: any;
  today = new Date();
  loadingStats = true;

  stats = [
    {
      icon: '👥', label: 'Utilisateurs',
      value: '—', percent: '0%',
      iconBg: 'rgba(45,106,79,0.12)',
      barColor: '#2d6a4f',
      trend: null,
      path: '/admin/users'
    },
    {
      icon: '📚', label: 'Ressources',
      value: '—', percent: '0%',
      iconBg: 'rgba(21,101,192,0.12)',
      barColor: '#1565c0',
      trend: null,
      path: '/admin/resources'
    },
    {
      icon: '📅', label: 'Événements',
      value: '—', percent: '0%',
      iconBg: 'rgba(230,81,0,0.12)',
      barColor: '#e65100',
      trend: null,
      path: '/admin/events'
    },
    {
      icon: '📢', label: 'Réclamations',
      value: '—', percent: '0%',
      iconBg: 'rgba(183,28,28,0.12)',
      barColor: '#b71c1c',
      trend: null,
      path: '/admin/complaints'
    },
    {
      icon: '😊', label: 'Humeurs',
      value: '—', percent: '0%',
      iconBg: 'rgba(106,27,154,0.12)',
      barColor: '#6a1b9a',
      trend: null,
      path: '/admin/moods'
    },
  ];

  quickActions = [
    {
      icon: '👤',
      title: 'Gérer les utilisateurs',
      desc: 'Voir et modifier les comptes',
      path: '/admin/users',
      bg: 'rgba(45,106,79,0.08)'
    },
    {
      icon: '📚',
      title: 'Ajouter une ressource',
      desc: 'Articles, vidéos, podcasts',
      path: '/admin/resources/new',
      bg: 'rgba(21,101,192,0.08)'
    },
    {
      icon: '📅',
      title: 'Créer un événement',
      desc: 'Yoga, méditation, coaching',
      path: '/admin/events/new',
      bg: 'rgba(230,81,0,0.08)'
    },
    {
      icon: '📢',
      title: 'Réclamations',
      desc: 'Traiter les demandes users',
      path: '/admin/complaints',
      bg: 'rgba(183,28,28,0.08)'
    },
    {
      icon: '💬',
      title: 'Messagerie',
      desc: 'Contacter les utilisateurs',
      path: '/admin/chat',
      bg: 'rgba(106,27,154,0.08)'
    },
    {
      icon: '😊',
      title: 'Humeurs',
      desc: 'Suivre le bien-être global',
      path: '/admin/moods',
      bg: 'rgba(0,77,64,0.08)'
    },
  ];


  recentActivity: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private moodService: MoodService,
    private eventService: EventService,
    private resourceService: ResourceService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;

    // ✅ Charger toutes les stats en parallèle
    forkJoin({
      users:      this.userService.getAllUsers(),
      moods:      this.moodService.getAllMoods(),
      events:     this.eventService.getAllEvents(),
      resources:  this.resourceService.getAllResources(),
      complaints: this.complaintService.getAllComplaints()
    }).subscribe({
      next: (data) => {
        const total = Math.max(
          data.users.length,
          data.moods.length,
          data.events.length,
          data.resources.length,
          data.complaints.length,
          1
        );

        // ✅ Mettre à jour les stats avec les vraies données
        this.stats[0].value   = String(data.users.length);
        this.stats[0].percent =
          Math.min((data.users.length / 50) * 100, 100) + '%';

        this.stats[1].value   = String(data.resources.length);
        this.stats[1].percent =
          Math.min((data.resources.length / 30) * 100, 100) + '%';

        this.stats[2].value   = String(data.events.length);
        this.stats[2].percent =
          Math.min((data.events.length / 20) * 100, 100) + '%';

        this.stats[3].value   = String(data.complaints.length);
        this.stats[3].percent =
          Math.min((data.complaints.length / 20) * 100, 100) + '%';

        this.stats[4].value   = String(data.moods.length);
        this.stats[4].percent =
          Math.min((data.moods.length / 200) * 100, 100) + '%';

        // ✅ Activité récente depuis les données réelles
        this.recentActivity = [
          {
            icon: '👥',
            text: `${data.users.length} utilisateurs inscrits`,
            time: 'Total'
          },
          {
            icon: '😊',
            text: `${data.moods.length} humeurs enregistrées`,
            time: 'Total'
          },
          {
            icon: '📢',
            text: `${data.complaints.filter(
              (c: any) => c.status === 'PENDING'
            ).length} réclamations en attente`,
            time: 'À traiter'
          },
          {
            icon: '📅',
            text: `${data.events.filter(
              (e: any) => e.status === 'UPCOMING'
            ).length} événements à venir`,
            time: 'Prochainement'
          },
          {
            icon: '📚',
            text: `${data.resources.length} ressources disponibles`,
            time: 'Total'
          },
        ];

        this.loadingStats = false;
      },
      error: () => {
        // ✅ En cas d'erreur → valeurs par défaut
        this.stats.forEach(s => s.value = 'N/A');
        this.loadingStats = false;
      }
    });
  }
}