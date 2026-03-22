import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  EventService
} from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  form: FormGroup;
  loading = false;
  saving = false;
  error = '';
  isEdit = false;
  eventId: number | null = null;
  user: any;                        // ✅ ajouté

  categories = [
    { value: 'YOGA',        label: 'Yoga',        icon: '🧘' },
    { value: 'MEDITATION',  label: 'Méditation',  icon: '🪷' },
    { value: 'NUTRITION',   label: 'Nutrition',   icon: '🥗' },
    { value: 'FITNESS',     label: 'Fitness',     icon: '💪' },
    { value: 'MINDFULNESS', label: 'Mindfulness', icon: '🌸' },
    { value: 'COACHING',    label: 'Coaching',    icon: '🎯' },
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title:           ['', Validators.required],
      description:     ['', Validators.required],
      category:        ['YOGA', Validators.required],
      location:        ['', Validators.required],
      eventDate:       ['', Validators.required],
      maxParticipants: [20, [Validators.required,
                             Validators.min(1)]],
      imageUrl:        ['']
    });
  }

  ngOnInit(): void {
    // ✅ Récupère l'utilisateur connecté
    this.user = this.authService.getUser();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.eventId = +id;
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.form.patchValue({
          title:           event.title,
          description:     event.description,
          category:        event.category,
          location:        event.location,
          eventDate:       event.eventDate?.split('T')[0],
          maxParticipants: event.maxParticipants,
          imageUrl:        event.imageUrl || ''
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Événement introuvable';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    // ✅ Ajoute createdBy = keycloakId
    const data = {
      ...this.form.value,
      createdBy: this.user?.keycloakId
    };

    const obs = this.isEdit && this.eventId
      ? this.eventService.updateEvent(this.eventId, data)
      : this.eventService.createEvent(data);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/admin/events']);
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement';
        this.saving = false;
      }
    });
  }

  getCategoryIcon(value: string): string {
    return this.categories.find(
      c => c.value === value
    )?.icon || '📅';
  }

  cancel(): void {
    this.router.navigate(['/admin/events']);
  }
}