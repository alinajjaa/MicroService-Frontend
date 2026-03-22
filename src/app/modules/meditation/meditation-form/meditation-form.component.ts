import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MeditationService
} from '../../../core/services/meditation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-meditation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meditation-form.component.html',
  styleUrls: ['./meditation-form.component.scss']
})
export class MeditationFormComponent implements OnInit {

  form: FormGroup;
  loading = false;
  saving = false;
  error = '';
  isEdit = false;
  sessionId: number | null = null;
  user: any;

  categories = [
    { value: 'BREATHING',  label: '🌬️ Respiration' },
    { value: 'SLEEP',      label: '😴 Sommeil' },
    { value: 'STRESS',     label: '😰 Anti-stress' },
    { value: 'FOCUS',      label: '🎯 Concentration' },
    { value: 'RELAXATION', label: '🧘 Relaxation' }
  ];

  constructor(
    private fb: FormBuilder,
    private meditationService: MeditationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      description: ['', Validators.required],
      category: ['BREATHING', Validators.required],
      duration: [10, [
        Validators.required,
        Validators.min(1),
        Validators.max(120)
      ]],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.sessionId = +id;
      this.loadSession(this.sessionId);
    }
  }

  loadSession(id: number): void {
    this.loading = true;
    this.meditationService.getSessionById(id).subscribe({
      next: (session) => {
        this.form.patchValue({
          title: session.title,
          description: session.description,
          category: session.category,
          duration: session.duration,
          imageUrl: session.imageUrl,
          isActive: session.isActive
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Séance introuvable';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = {
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.form.value.category,
      duration: this.form.value.duration,
      imageUrl: this.form.value.imageUrl || '',
      isActive: this.form.value.isActive,
       createdBy: this.user.keycloakId // ← ajoutez

    };

    const obs = this.isEdit && this.sessionId
      ? this.meditationService.updateSession(
          this.sessionId, data)
      : this.meditationService.createSession(data);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/admin/meditations']);
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/meditations']);
  }

  get f() { return this.form.controls; }
}