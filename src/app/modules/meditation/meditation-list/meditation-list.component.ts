import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MeditationService,
  MeditationSession,
  MeditationHistoryResponse,
  MeditationStats
} from '../../../core/services/meditation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-meditation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meditation-list.component.html',
  styleUrls: ['./meditation-list.component.scss']
})
export class MeditationListComponent implements OnInit {

  user: any;
  sessions: MeditationSession[] = [];
  filteredSessions: MeditationSession[] = [];
  history: MeditationHistoryResponse[] = [];
  stats: MeditationStats | null = null;

  loading = false;
  error = '';
  success = '';

  selectedCategory = 'ALL';
  activeTab = 'sessions'; // sessions | history

  categories = [
    { value: 'ALL',        label: 'Toutes',        emoji: '🌟' },
    { value: 'BREATHING',  label: 'Respiration',   emoji: '🌬️' },
    { value: 'SLEEP',      label: 'Sommeil',       emoji: '😴' },
    { value: 'STRESS',     label: 'Anti-stress',   emoji: '😰' },
    { value: 'FOCUS',      label: 'Concentration', emoji: '🎯' },
    { value: 'RELAXATION', label: 'Relaxation',    emoji: '🧘' }
  ];

  constructor(
    private meditationService: MeditationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadSessions();
    this.loadHistory();
    this.loadStats();
  }

  // ✅ Charger séances
  loadSessions(): void {
    this.loading = true;
    this.meditationService.getActiveSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  // ✅ Charger historique
  loadHistory(): void {
    const userId = this.user?.keycloakId;
    if (!userId) return;
    this.meditationService.getMyHistory(userId).subscribe({
      next: (data) => {
        this.history = data.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      },
      error: () => {}
    });
  }

  // ✅ Charger stats
  loadStats(): void {
    const userId = this.user?.keycloakId;
    if (!userId) return;
    this.meditationService.getMyStats(userId).subscribe({
      next: (data) => this.stats = data,
      error: () => {}
    });
  }

  // ✅ Filtrer par catégorie
  applyFilter(): void {
    if (this.selectedCategory === 'ALL') {
      this.filteredSessions = this.sessions;
    } else {
      this.filteredSessions = this.sessions.filter(
        s => s.category === this.selectedCategory
      );
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  // ✅ Lancer timer
  startSession(session: MeditationSession): void {
    this.router.navigate(
      ['/home/meditations/timer'],
      { state: { session } }
    );
  }

  // ✅ Supprimer historique
  deleteHistory(id: number): void {
    if (!confirm('Supprimer cette entrée ?')) return;
    this.meditationService.deleteHistory(id).subscribe({
      next: () => {
        this.success = 'Entrée supprimée';
        this.loadHistory();
        this.loadStats();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur suppression'
    });
  }

  getCategoryInfo(category: string) {
    return this.categories.find(
      c => c.value === category
    ) || { emoji: '🧘', label: category };
  }

  getCategoryColor(category: string): string {
    const map: any = {
      BREATHING:  '#e3f2fd',
      SLEEP:      '#f3e5f5',
      STRESS:     '#fce4ec',
      FOCUS:      '#fff8e1',
      RELAXATION: '#e8f5e9'
    };
    return map[category] || '#f5f5f5';
  }

  getStatusLabel(status: string): string {
    return status === 'COMPLETED' ?
      '✅ Terminée' : '❌ Annulée';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  goToCreate(): void {
  this.router.navigate(['/admin/meditations/new']);
}

goToEdit(id: number): void {
  this.router.navigate([`/admin/meditations/edit/${id}`]);
}
}