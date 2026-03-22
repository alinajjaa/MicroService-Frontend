import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  MeditationService,
  MeditationSession
} from '../../../core/services/meditation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-meditation-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meditation-timer.component.html',
  styleUrls: ['./meditation-timer.component.scss']
})
export class MeditationTimerComponent
    implements OnInit, OnDestroy {

  user: any;
  session: MeditationSession | null = null;

  totalSeconds = 0;
  remainingSeconds = 0;
  elapsedSeconds = 0;

  isRunning = false;
  isFinished = false;
  isPaused = false;

  private intervalId: any;

  constructor(
    private meditationService: MeditationService,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ Récupérer la session depuis navigation state
    const nav = this.router.getCurrentNavigation();
    this.session = nav?.extras?.state?.['session'] || null;
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.session) {
      this.router.navigate(['/home/meditations']);
      return;
    }
    this.totalSeconds = this.session.duration * 60;
    this.remainingSeconds = this.totalSeconds;
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.isRunning = true;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.elapsedSeconds++;
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isPaused = true;
    this.isRunning = false;
    this.clearTimer();
  }

  resumeTimer(): void {
    this.startTimer();
  }

  stopSession(): void {
    this.clearTimer();
    this.saveSession('CANCELLED');
  }

  completeSession(): void {
    this.clearTimer();
    this.isFinished = true;
    this.saveSession('COMPLETED');
  }

  saveSession(status: string): void {
    if (!this.session || !this.user) return;

    const actualMinutes = Math.ceil(
      this.elapsedSeconds / 60
    );

    const data = {
      userId: this.user.keycloakId,
      sessionId: this.session.id,
      sessionTitle: this.session.title,
      category: this.session.category,
      plannedDuration: this.session.duration,
      actualDuration: actualMinutes,
      status: status
    };

    this.meditationService.saveHistory(data).subscribe({
      next: () => {
        if (status === 'COMPLETED') {
          this.isFinished = true;
        } else {
          this.router.navigate(['/home/meditations']);
        }
      },
      error: () => {
        this.router.navigate(['/home/meditations']);
      }
    });
  }

  clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // ✅ Formatage temps
  get formattedTime(): string {
    const min = Math.floor(this.remainingSeconds / 60);
    const sec = this.remainingSeconds % 60;
    return `${this.pad(min)}:${this.pad(sec)}`;
  }

  get progressPercent(): number {
    if (this.totalSeconds === 0) return 0;
    return Math.round(
      (this.elapsedSeconds / this.totalSeconds) * 100
    );
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  goBack(): void {
    this.router.navigate(['/home/meditations']);
  }
}