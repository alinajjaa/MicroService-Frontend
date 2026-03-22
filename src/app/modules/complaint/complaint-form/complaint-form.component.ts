import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ComplaintService
} from '../../../core/services/complaint.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.scss']
})
export class ComplaintFormComponent implements OnInit {

  form: FormGroup;
  saving = false;
  error = '';
  user: any;

  // ✅ Sujets prédéfinis
  subjects = [
    { value: 'Problème technique',    icon: '🔧' },
    { value: 'Problème de paiement',  icon: '💳' },
    { value: 'Contenu inapproprié',   icon: '🚫' },
    { value: 'Problème de compte',    icon: '👤' },
    { value: 'Suggestion',            icon: '💡' },
    { value: 'Autre',                 icon: '📝' },
  ];

  selectedSubject = '';
  customSubject = false;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      subject:     ['', Validators.required],
      description: ['', [Validators.required,
                         Validators.minLength(20),
                         Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  selectSubject(subject: string): void {
    this.selectedSubject = subject;
    if (subject === 'Autre') {
      this.customSubject = true;
      this.form.get('subject')?.setValue('');
    } else {
      this.customSubject = false;
      this.form.get('subject')?.setValue(subject);
    }
  }

  get descLength(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  get descProgress(): number {
    return Math.min((this.descLength / 500) * 100, 100);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = {
      subject:     this.form.value.subject,
      description: this.form.value.description,
      userId:      this.user.keycloakId,   // ✅ keycloakId
      userEmail:   this.user.email
    };

    this.complaintService.createComplaint(data).subscribe({
      next: () => {
        this.router.navigate(['/home/complaints']);
      },
      error: () => {
        this.error = 'Erreur lors de la soumission';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/home/complaints']);
  }
}