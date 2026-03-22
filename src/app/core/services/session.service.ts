import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {

  // ✅ Signal pour afficher/cacher l'alerte
  isExpired = signal(false);
  countdown = signal(10);
  private timer: any;
  private countdownTimer: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  showExpiredAlert(): void {
    // ✅ Éviter les doublons
    if (this.isExpired()) return;

    this.isExpired.set(true);
    this.countdown.set(10);

    // ✅ Countdown 10 → 0
    this.countdownTimer = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        this.redirectToLogin();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  redirectToLogin(): void {
    clearInterval(this.countdownTimer);
    clearTimeout(this.timer);
    this.isExpired.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  dismiss(): void {
    clearInterval(this.countdownTimer);
    clearTimeout(this.timer);
    this.isExpired.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}