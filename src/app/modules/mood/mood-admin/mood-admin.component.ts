import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  MoodService,
  MoodResponse
} from '../../../core/services/mood.service';
import {
  UserService,
  UserResponse
} from '../../../core/services/user.service';

@Component({
  selector: 'app-mood-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood-admin.component.html',
  styleUrls: ['./mood-admin.component.scss']
})
export class MoodAdminComponent implements OnInit {

  moods: MoodResponse[] = [];
  filteredMoods: MoodResponse[] = [];
  userNames: Map<string, string> = new Map();

  loading = false;
  error = '';
  searchTerm = '';
filterLevel: number | '' = '';

  moodEmojis = ['😢', '😕', '😐', '🙂', '😊',
                '😄', '😁', '🤩', '😍', '🥳'];
  moodLabels = ['Très mal', 'Mal', 'Pas bien', 'Bof',
                'Neutre', 'Bien', 'Très bien',
                'Super', 'Excellent', 'Parfait'];

  constructor(
    private moodService: MoodService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllMoods();
  }

  loadAllMoods(): void {
    this.loading = true;
    this.error = '';

    this.moodService.getAllMoods().subscribe({
      next: (data) => {
        this.moods = data.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
        this.filteredMoods = [...this.moods];
        this.loading = false;
        this.loadUserNames();
      },
      error: () => {
        this.error = 'Erreur lors du chargement des humeurs';
        this.loading = false;
      }
    });
  }

  loadUserNames(): void {
    // Récupérer les IDs uniques
    const uniqueIds = [...new Set(this.moods.map(m => m.userId))];

    if (uniqueIds.length === 0) return;

    // Appel parallèle pour chaque utilisateur
    const requests = uniqueIds.map(id =>
      this.userService.getUserByKeycloakId(id).pipe(
        map((user: UserResponse) => ({
          id,
          name: this.buildDisplayName(user)
        })),
        catchError(() => of({ id, name: id.slice(0, 8) + '...' }))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        results.forEach(r => this.userNames.set(r.id, r.name));
        // Rafraîchir le filtre pour que la recherche prenne en compte les noms
        this.search();
      },
      error: () => {
        // Silencieux : on garde les IDs tronqués comme fallback
      }
    });
  }

  buildDisplayName(user: UserResponse): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    if (user.email) return user.email;
    return user.keycloakId?.slice(0, 8) + '...' || '—';
  }

  getUserName(userId: string): string {
    return this.userNames.get(userId) || userId.slice(0, 8) + '...';
  }

search(): void {
  this.filteredMoods = this.moods.filter(m => {
    const userName = this.getUserName(m.userId).toLowerCase();

    const matchSearch = !this.searchTerm ||
      userName.includes(this.searchTerm.toLowerCase()) ||
      m.userId.toLowerCase().includes(
        this.searchTerm.toLowerCase()) ||
      m.note?.toLowerCase().includes(
        this.searchTerm.toLowerCase());

    const matchLevel = !this.filterLevel ||
      m.moodLevel === this.filterLevel; // ✅ number === number

    return matchSearch && matchLevel;
  });
}

  deleteMood(id: number): void {
    if (!confirm('Supprimer cette humeur ?')) return;
    this.moodService.deleteMood(id).subscribe({
      next: () => this.loadAllMoods(),
      error: () => this.error = 'Erreur lors de la suppression'
    });
  }

  getMoodEmoji(level: number | undefined): string {
    if (!level) return '😊';
    return this.moodEmojis[level - 1] || '😐';
  }

  getMoodLabel(level: number | undefined): string {
    if (!level) return 'Neutre';
    return this.moodLabels[level - 1] || 'Neutre';
  }

  getMoodColor(level: number): string {
    if (level <= 3) return '#ffebee';
    if (level <= 5) return '#fff8e1';
    if (level <= 7) return '#e8f5e9';
    return '#e3f2fd';
  }
getLevelColor(level: number): string {
  if (level <= 3) return '#ef5350';
  if (level <= 5) return '#ffa726';
  if (level <= 7) return '#66bb6a';
  return '#42a5f5';
}
  get stats() {
    const total = this.moods.length;
    const avg = total
      ? Math.round(this.moods.reduce(
          (a, b) => a + b.moodLevel, 0) / total)
      : 0;
    const happy = this.moods.filter(m => m.moodLevel >= 7).length;
    const sad   = this.moods.filter(m => m.moodLevel <= 3).length;
    return { total, avg, happy, sad };
  }
}