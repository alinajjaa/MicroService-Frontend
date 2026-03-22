import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,
         FormBuilder, FormGroup,
         Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ComplaintService,
  ComplaintResponse,
  UpdateStatusRequest
} from '../../../core/services/complaint.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {

  user: any;
  complaints: ComplaintResponse[] = [];
  filteredComplaints: ComplaintResponse[] = [];
  selectedComplaint: ComplaintResponse | null = null;
  loading = false;
  error = '';
  success = '';
  showDetail = false;
  showForm = false;              // ✅ ajouté
  selectedStatus = '';
  form: FormGroup;               // ✅ ajouté
  statusForm: FormGroup;

  statuses = [
    {
      value: 'PENDING',
      label: 'En attente',
      color: '#fff8e1',
      text: '#b7791f',
      icon: '🟡'
    },
    {
      value: 'IN_PROGRESS',
      label: 'En cours',
      color: '#e3f2fd',
      text: '#1565c0',
      icon: '🔵'
    },
    {
      value: 'RESOLVED',
      label: 'Résolu',
      color: '#e8f5e9',
      text: '#2e7d32',
      icon: '🟢'
    },
    {
      value: 'REJECTED',
      label: 'Rejeté',
      color: '#ffebee',
      text: '#c62828',
      icon: '🔴'
    },
  ];

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // ✅ form pour soumettre une réclamation
    this.form = this.fb.group({
      subject:     ['', Validators.required],
      description: ['', [Validators.required,
                         Validators.minLength(20)]]
    });

    // ✅ statusForm pour changer le statut (ADMIN)
    this.statusForm = this.fb.group({
      status:  ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    const obs = this.isAdmin
      ? this.complaintService.getAllComplaints()
      : this.complaintService.getMyComplaints(
          this.user.keycloakId
        );

    obs.subscribe({
      next: (data: ComplaintResponse[]) => {
        this.complaints = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredComplaints = this.complaints.filter(c =>
      !this.selectedStatus ||
      c.status === this.selectedStatus
    );
  }

  // ✅ Soumettre une réclamation (USER)
  submitComplaint(): void {
    if (this.form.invalid) return;
    const data = {
      ...this.form.value,
      userId:    this.user.keycloakId,
      userEmail: this.user.email
    };
    this.complaintService.createComplaint(data).subscribe({
      next: () => {
        this.success = 'Réclamation soumise ! ✅';
        this.showForm = false;
        this.form.reset();
        this.loadComplaints();
        setTimeout(() => this.success = '', 4000);
      },
      error: () => this.error = 'Erreur lors de la soumission'
    });
  }

  // ✅ Aller vers le formulaire séparé
  goToForm(): void {
    this.router.navigate(['/home/complaints/new']);
  }

  openDetail(complaint: ComplaintResponse): void {
    this.selectedComplaint = complaint;
    this.showDetail = true;
    this.statusForm.reset();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedComplaint = null;
  }

  updateStatus(): void {
    if (this.statusForm.invalid || !this.selectedComplaint)
      return;

    const data: UpdateStatusRequest = {
      ...this.statusForm.value,
      changedBy: this.user.keycloakId
    };

    this.complaintService.updateStatus(
      this.selectedComplaint.id, data
    ).subscribe({
      next: (updated: ComplaintResponse) => {
        this.success = 'Statut mis à jour !';
        this.selectedComplaint = updated;
        this.loadComplaints();
        this.statusForm.reset();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur mise à jour'
    });
  }

  deleteComplaint(id: number): void {
    if (!confirm('Supprimer cette réclamation ?')) return;
    this.complaintService.deleteComplaint(id).subscribe({
      next: () => {
        this.success = 'Réclamation supprimée';
        this.closeDetail();
        this.loadComplaints();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur suppression'
    });
  }

  getStatusInfo(status: string) {
    return this.statuses.find(s => s.value === status) ||
      { label: status, color: '#f5f5f5',
        text: '#333', icon: '⚪' };
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  get stats() {
    return {
      total:      this.complaints.length,
      pending:    this.complaints.filter(
        c => c.status === 'PENDING').length,
      inProgress: this.complaints.filter(
        c => c.status === 'IN_PROGRESS').length,
      resolved:   this.complaints.filter(
        c => c.status === 'RESOLVED').length,
      rejected:   this.complaints.filter(
        c => c.status === 'REJECTED').length,
    };
  }
}