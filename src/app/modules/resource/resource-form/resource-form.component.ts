import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ResourceService
} from '../../../core/services/resource.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class ResourceFormComponent implements OnInit {

  form: FormGroup;
  loading = false;
  saving = false;
  error = '';
  isEdit = false;
  resourceId: number | null = null;
  user: any;

  // ✅ Correspond aux enums ResourceType du backend
  types = [
    { value: 'ARTICLE',  label: 'Article',  icon: '📄' },
    { value: 'VIDEO',    label: 'Vidéo',    icon: '🎥' },
    { value: 'PODCAST',  label: 'Podcast',  icon: '🎙️' },
    { value: 'EXERCISE', label: 'Exercice', icon: '💪' },
  ];

  // ✅ Correspond aux enums Category du backend
  categories = [
    { value: 'MEDITATION',  label: 'Méditation' },
    { value: 'YOGA',        label: 'Yoga' },
    { value: 'NUTRITION',   label: 'Nutrition' },
    { value: 'SLEEP',       label: 'Sommeil' },
    { value: 'STRESS',      label: 'Stress' },
    { value: 'ANXIETY',     label: 'Anxiété' },
    { value: 'DEPRESSION',  label: 'Dépression' },
    { value: 'MINDFULNESS', label: 'Mindfulness' },
    { value: 'FITNESS',     label: 'Fitness' },
  ];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title:           ['', Validators.required],
      description:     ['', Validators.required],
      type:            ['ARTICLE', Validators.required],
      url:             ['', [Validators.required,
                             Validators.pattern('https?://.+')]],
      category:        ['MEDITATION', Validators.required],
      thumbnailUrl:    [''],      // ✅ thumbnailUrl (pas imageUrl)
      author:          [''],
      durationMinutes: [null]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.resourceId = +id;
      this.loadResource(this.resourceId);
    }
  }

  loadResource(id: number): void {
    this.loading = true;
    this.resourceService.getResourceById(id).subscribe({
      next: (r) => {
        this.form.patchValue({
          title:           r.title,
          description:     r.description,
          type:            r.type,
          url:             r.url,
          category:        r.category,
          thumbnailUrl:    r.thumbnailUrl || '',  // ✅
          author:          r.author || '',
          durationMinutes: r.durationMinutes || null
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Ressource introuvable';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = {
      ...this.form.value,
      createdBy: this.user?.keycloakId   // ✅ keycloakId
    };

    const obs = this.isEdit && this.resourceId
      ? this.resourceService.updateResource(
          this.resourceId, data)
      : this.resourceService.createResource(data);

    obs.subscribe({
      next: () =>
        this.router.navigate(['/admin/resources']),
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement';
        this.saving = false;
      }
    });
  }

  getTypeIcon(value: string): string {
    return this.types.find(
      t => t.value === value
    )?.icon || '📄';
  }

  cancel(): void {
    this.router.navigate(['/admin/resources']);
  }
}
