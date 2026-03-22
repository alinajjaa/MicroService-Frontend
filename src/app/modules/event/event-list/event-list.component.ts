// ✅ Fix status UPCOMING — utilise ngModel au lieu de [value]
// ✅ Ajouter showParticipants modal

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  EventService,
  EventResponse
} from '../../../core/services/event.service';
import { UserService } from
  '../../../core/services/user.service';
import { AuthService } from
  '../../../core/services/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  user: any;
  events: EventResponse[] = [];
  filteredEvents: EventResponse[] = [];
  myEvents: EventResponse[] = [];
  loading = false;
  error = '';
  success = '';
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  activeTab = 'all';

  // ✅ Rating modal
  showRating = false;
  ratingEvent: EventResponse | null = null;
  ratingValue = 5;
  ratingComment = '';

  // ✅ Detail modal
  showDetail = false;
  detailEvent: EventResponse | null = null;

  // ✅ Participants modal
  showParticipants = false;
  participantsEvent: EventResponse | null = null;
  participantsList: any[] = [];
  loadingParticipants = false;

  // ✅ Status en cours de modification par event
  eventStatusMap: { [key: number]: string } = {};

  categories = [
    { value: 'YOGA',        label: 'Yoga',        icon: '🧘' },
    { value: 'MEDITATION',  label: 'Méditation',  icon: '🪷' },
    { value: 'NUTRITION',   label: 'Nutrition',   icon: '🥗' },
    { value: 'FITNESS',     label: 'Fitness',     icon: '💪' },
    { value: 'MINDFULNESS', label: 'Mindfulness', icon: '🌸' },
    { value: 'COACHING',    label: 'Coaching',    icon: '🎯' },
  ];

  statuses = [
    { value: 'UPCOMING',  label: 'À venir',  icon: '🟢' },
    { value: 'ONGOING',   label: 'En cours', icon: '🔵' },
    { value: 'COMPLETED', label: 'Terminé',  icon: '⚫' },
    { value: 'CANCELLED', label: 'Annulé',   icon: '🔴' },
  ];

  adminStatuses = [
    { value: 'UPCOMING',  label: '🟢 À venir'  },
    { value: 'ONGOING',   label: '🔵 En cours' },
    { value: 'COMPLETED', label: '⚫ Terminé'  },
    { value: 'CANCELLED', label: '🔴 Annulé'  },
  ];

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents(
      this.user.keycloakId
    ).subscribe({
      next: (data) => {
        this.events = data;
        // ✅ Initialiser le statusMap
        data.forEach(e => {
          this.eventStatusMap[e.id] = e.status;
        });
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });

    if (!this.isAdmin) {
      this.loadMyEvents();
    }
  }

  loadMyEvents(): void {
    this.eventService.getMyEvents(
      this.user.keycloakId
    ).subscribe({
      next: (data) => this.myEvents = data,
      error: () => {}
    });
  }

  applyFilters(): void {
    let list = this.activeTab === 'mine'
      ? this.myEvents
      : this.events;

    this.filteredEvents = list.filter(e => {
      const matchSearch = !this.searchTerm ||
        e.title.toLowerCase().includes(
          this.searchTerm.toLowerCase()) ||
        e.location?.toLowerCase().includes(
          this.searchTerm.toLowerCase());
      const matchCat = !this.selectedCategory ||
        e.category === this.selectedCategory;
      const matchStatus = !this.selectedStatus ||
        e.status === this.selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  // ✅ S'inscrire
  register(event: EventResponse): void {
    const data = {
      userId:   this.user.keycloakId,
      userName: `${this.user.firstName} ${this.user.lastName}`
    };
    this.eventService.register(event.id, data).subscribe({
      next: (updated) => {
        this.success = '✅ Inscription confirmée !';
        this.updateEventInList(updated);
        this.loadMyEvents();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ||
          'Erreur lors de l\'inscription';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  // ✅ Se désinscrire
  unregister(event: EventResponse): void {
    if (!confirm('Se désinscrire de cet événement ?')) return;
    this.eventService.unregister(
      event.id, this.user.keycloakId
    ).subscribe({
      next: (updated) => {
        this.success = 'Désinscription effectuée';
        this.updateEventInList(updated);
        this.loadMyEvents();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur désinscription'
    });
  }

  // ✅ Fix — Changer statut avec ngModel
  onStatusChange(event: EventResponse,
                  newStatus: string): void {
    if (!newStatus || newStatus === event.status) return;

    this.eventService.updateStatus(
      event.id, { status: newStatus }
    ).subscribe({
      next: (updated) => {
        this.success = `Statut → ${newStatus} ✅`;
        this.updateEventInList(updated);
        this.eventStatusMap[updated.id] = updated.status;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Erreur changement statut';
        // ✅ Remettre l'ancien statut
        this.eventStatusMap[event.id] = event.status;
      }
    });
  }

  // ✅ Ouvrir liste participants (ADMIN)
  openParticipants(event: EventResponse): void {
    this.participantsEvent = event;
    this.showParticipants = true;
    this.loadingParticipants = true;
    this.participantsList = [];

    // ✅ Charger les infos de chaque participant
    if (event.participantIds &&
        event.participantIds.length > 0) {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.participantsList = users.filter(u =>
            event.participantIds.includes(u.keycloakId)
          );
          this.loadingParticipants = false;
        },
        error: () => {
          this.loadingParticipants = false;
        }
      });
    } else {
      this.loadingParticipants = false;
    }
  }

  // ✅ Ouvrir modal rating
  openRating(event: EventResponse): void {
    this.ratingEvent  = event;
    this.ratingValue  = 5;
    this.ratingComment = '';
    this.showRating   = true;
  }

  // ✅ Soumettre rating
  submitRating(): void {
    if (!this.ratingEvent) return;
    const data = {
      userId:  this.user.keycloakId,
      rating:  this.ratingValue,
      comment: this.ratingComment
    };
    this.eventService.rateEvent(
      this.ratingEvent.id, data
    ).subscribe({
      next: (updated) => {
        this.success = '⭐ Merci pour votre avis !';
        this.updateEventInList(updated);
        this.showRating = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ||
          'Erreur lors de la notation';
      }
    });
  }

  openDetail(event: EventResponse): void {
    this.detailEvent = event;
    this.showDetail  = true;
  }

  updateEventInList(updated: EventResponse): void {
    const idx = this.events.findIndex(
      e => e.id === updated.id
    );
    if (idx !== -1) this.events[idx] = updated;
    this.applyFilters();
  }

  goToCreate(): void {
    this.router.navigate(['/admin/events/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate([`/admin/events/edit/${id}`]);
  }

  deleteEvent(id: number): void {
    if (!confirm('Supprimer cet événement ?')) return;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.success = 'Événement supprimé';
        this.events = this.events.filter(e => e.id !== id);
        this.applyFilters();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur suppression'
    });
  }

  getCategoryInfo(cat: string) {
    return this.categories.find(c => c.value === cat) ||
      { icon: '📅', label: cat };
  }

  getStatusInfo(status: string) {
    const map: any = {
      UPCOMING:  { label: 'À venir',  color: '#e8f5e9',
                   text: '#2e7d32', icon: '🟢' },
      ONGOING:   { label: 'En cours', color: '#e3f2fd',
                   text: '#1565c0', icon: '🔵' },
      COMPLETED: { label: 'Terminé',  color: '#f5f5f5',
                   text: '#555',    icon: '⚫' },
      CANCELLED: { label: 'Annulé',   color: '#ffebee',
                   text: '#c62828', icon: '🔴' },
    };
    return map[status] || {
      label: status, color: '#f5f5f5',
      text: '#555',  icon: '⚪'
    };
  }

  getProgressColor(event: EventResponse): string {
    const pct = (event.currentParticipants /
                 event.maxParticipants) * 100;
    if (pct >= 100) return '#f44336';
    if (pct >= 75)  return '#ff9800';
    return '#4caf50';
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) =>
      i < Math.round(rating) ? '⭐' : '☆'
    );
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }
}