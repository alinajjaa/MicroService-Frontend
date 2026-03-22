import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ResourceService,
  ResourceResponse
} from '../../../core/services/resource.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {

  user: any;
  resources: ResourceResponse[] = [];
  filteredResources: ResourceResponse[] = [];
  loading = false;
  error = '';
  success = '';
  searchTerm = '';
  selectedType = '';

  types = [
    { value: 'ARTICLE', label: 'Articles',  icon: '📄' },
    { value: 'VIDEO',   label: 'Vidéos',    icon: '🎥' },
    { value: 'PODCAST', label: 'Podcasts',  icon: '🎙️' },
    { value: 'EBOOK',   label: 'E-Books',   icon: '📚' },
    { value: 'GUIDE',   label: 'Guides',    icon: '🗺️' },
  ];

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.resourceService.getAllResources().subscribe({
      next: (data) => {
        this.resources = data.sort((a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
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
    this.filteredResources = this.resources.filter(r => {
      const matchSearch = !this.searchTerm ||
        r.title.toLowerCase().includes(
          this.searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(
          this.searchTerm.toLowerCase());
      const matchType = !this.selectedType ||
        r.type === this.selectedType;
      return matchSearch && matchType;
    });
  }

  goToCreate(): void {
    const base = this.isAdmin ? '/admin' : '/home';
    this.router.navigate([`${base}/resources/new`]);
  }

  goToEdit(id: number): void {
    this.router.navigate([`/admin/resources/edit/${id}`]);
  }

  deleteResource(id: number): void {
    if (!confirm('Supprimer cette ressource ?')) return;
    this.resourceService.deleteResource(id).subscribe({
      next: () => {
        this.success = 'Ressource supprimée';
        this.loadResources();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erreur suppression'
    });
  }

  getTypeInfo(type: string) {
    return this.types.find(t => t.value === type) ||
      { icon: '📄', label: type };
  }

  getTypeColor(type: string): string {
    const map: any = {
      ARTICLE: '#e3f2fd',
      VIDEO:   '#fce4ec',
      PODCAST: '#f3e5f5',
      EBOOK:   '#e8f5e9',
      GUIDE:   '#fff8e1'
    };
    return map[type] || '#f5f5f5';
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }
}