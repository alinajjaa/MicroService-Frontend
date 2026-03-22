import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  UserService,
  UserResponse
} from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  filterRole = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading = true;
    this.error = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  search(): void {
    this.filteredUsers = this.users.filter(u => {
      const matchSearch = !this.searchTerm ||
        u.firstName?.toLowerCase().includes(
          this.searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(
          this.searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(
          this.searchTerm.toLowerCase());

      const matchRole = !this.filterRole ||
        u.role === this.filterRole;

      return matchSearch && matchRole;
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadAllUsers(),
      error: () => this.error = 'Erreur suppression'
    });
  }

  getInitials(user: UserResponse): string {
    const f = user.firstName?.charAt(0) || '';
    const l = user.lastName?.charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  }

  getAvatarColor(user: UserResponse): string {
    const colors = [
      '#4CAF50', '#2196F3', '#9C27B0',
      '#FF9800', '#F44336', '#00BCD4',
      '#E91E63', '#3F51B5'
    ];
    return colors[(user.id || 0) % colors.length];
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'badge-admin' : 'badge-user';
  }

  get stats() {
    const total  = this.users.length;
    const admins = this.users.filter(u => u.role === 'ADMIN').length;
    const users  = this.users.filter(u => u.role === 'USER').length;
    return { total, admins, users };
  }
}