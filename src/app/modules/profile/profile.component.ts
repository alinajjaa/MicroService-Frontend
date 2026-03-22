import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MoodService } from '../../core/services/mood.service';
import { EventService } from '../../core/services/event.service';
import { ComplaintService } from
  '../../core/services/complaint.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  activeTab = 'info';
  saving = false;
  success = '';
  error = '';
  showPasswordForm = false;

  // ✅ Stats personnelles
  stats = {
    moods:      0,
    events:     0,
    complaints: 0,
    messages:   0
  };

  form: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private moodService: MoodService,
    private eventService: EventService,
    private complaintService: ComplaintService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required,
                       Validators.email]],
      phone:     ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required,
                             Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadStats();

    // ✅ Pré-remplir le formulaire
    this.form.patchValue({
      firstName: this.user?.firstName,
      lastName:  this.user?.lastName,
      email:     this.user?.email,
      phone:     this.user?.phone || ''
    });
  }

  loadStats(): void {
    // ✅ Humeurs
    this.moodService.getMyMoods(
      this.user.keycloakId
    ).subscribe({
      next: (data) => this.stats.moods = data.length,
      error: () => {}
    });

    // ✅ Mes événements
    this.eventService.getMyEvents(
      this.user.keycloakId
    ).subscribe({
      next: (data) => this.stats.events = data.length,
      error: () => {}
    });

    // ✅ Mes réclamations
    this.complaintService.getMyComplaints(
      this.user.keycloakId
    ).subscribe({
      next: (data) => this.stats.complaints = data.length,
      error: () => {}
    });
  }

  saveProfile(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const updated = {
      ...this.user,
      ...this.form.value
    };

    // ✅ Mettre à jour le localStorage
    this.authService.saveUser(updated);
    this.user = updated;
    this.success = 'Profil mis à jour avec succès !';
    this.saving = false;
    setTimeout(() => this.success = '', 3000);
  }

  passwordsMatch(group: FormGroup) {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  getInitials(): string {
    const f = this.user?.firstName?.charAt(0) || '';
    const l = this.user?.lastName?.charAt(0) || '';
    return (f + l).toUpperCase();
  }

  getAvatarColor(): string {
    const colors = [
      'linear-gradient(135deg, #1a472a, #52b788)',
      'linear-gradient(135deg, #1565c0, #42a5f5)',
      'linear-gradient(135deg, #6a1b9a, #ab47bc)',
      'linear-gradient(135deg, #e65100, #ffa726)',
    ];
    const name = this.user?.firstName || '';
    return colors[name.charCodeAt(0) % colors.length];
  }

  getMemberSince(): string {
    const date = this.user?.createdAt;
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'long', year: 'numeric'
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.success = '';
    this.error = '';
  }

  logout(): void {
    this.authService.logout();
  }
}