import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MoodService,
  MoodResponse
} from '../../../core/services/mood.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mood-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mood-list.component.html',
  styleUrls: ['./mood-list.component.scss']
})
export class MoodListComponent implements OnInit {

  user: any;
  moods: MoodResponse[] = [];
  loading = false;
  error = '';
  success = '';

  showForm = false;
  moodLevel = 5;
  note = '';
  editingMood: MoodResponse | null = null;

  moodEmojis = ['😢', '😕', '😐', '🙂', '😊',
                '😄', '😁', '🤩', '😍', '🥳'];
  moodLabels = ['Très mal', 'Mal', 'Pas bien', 'Bof',
                'Neutre', 'Bien', 'Très bien',
                'Super', 'Excellent', 'Parfait'];

  constructor(
    private moodService: MoodService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadMoods();
  }

  loadMoods(): void {
    this.loading = true;

    // ✅ Utilise keycloakId
    const userId = this.user.keycloakId;

    this.moodService.getMyMoods(userId).subscribe({
      next: (data) => {
        this.moods = data.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

saveMood(): void {
  const data = {
    userId: this.user.keycloakId,
    moodLevel: this.moodLevel,
    moodType: 'NEUTRAL',        // ✅ valeur par défaut
    note: this.note,
    date: new Date().toISOString().split('T')[0]
  };

    if (this.editingMood) {
      this.moodService.updateMood(this.editingMood.id, data)
        .subscribe({
          next: () => {
            this.success = 'Humeur mise à jour !';
            this.resetForm();
            this.loadMoods();
          },
          error: () =>
            this.error = 'Erreur lors de la mise à jour'
        });
    } else {
      this.moodService.createMood(data).subscribe({
        next: () => {
          this.success = 'Humeur enregistrée ! 🎉';
          this.resetForm();
          this.loadMoods();
        },
        error: () =>
          this.error = 'Erreur lors de l\'enregistrement'
      });
    }
  }

  editMood(mood: MoodResponse): void {
    this.editingMood = mood;
    this.moodLevel = mood.moodLevel;
    this.note = mood.note;
    this.showForm = true;
  }

  deleteMood(id: number): void {
    if (!confirm('Supprimer cette humeur ?')) return;
    this.moodService.deleteMood(id).subscribe({
      next: () => {
        this.success = 'Humeur supprimée';
        this.loadMoods();
      },
      error: () =>
        this.error = 'Erreur lors de la suppression'
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editingMood = null;
    this.moodLevel = 5;
    this.note = '';
    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 3000);
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

  get averageMood(): number {
    if (!this.moods.length) return 0;
    const sum = this.moods.reduce(
      (a, b) => a + b.moodLevel, 0
    );
    return Math.round(sum / this.moods.length);
  }
}