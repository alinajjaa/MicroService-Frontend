import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResourceRequest {
  title: string;
  description: string;
  type: string;
  url: string;
  category: string;
  thumbnailUrl?: string;       // ✅
  author?: string;             // ✅
  durationMinutes?: number;    // ✅
  createdBy?: string;          // ✅ keycloakId
}

export interface ResourceResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
  category: string;
  thumbnailUrl?: string;       // ✅
  author?: string;             // ✅
  durationMinutes?: number;    // ✅
  published: boolean;
  createdBy?: string;          // ✅ keycloakId
  creatorName?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {

  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient) {}

  getAllResources(): Observable<ResourceResponse[]> {
    return this.http.get<ResourceResponse[]>(this.apiUrl);
  }

  getResourceById(id: number): Observable<ResourceResponse> {
    return this.http.get<ResourceResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  getByType(type: string): Observable<ResourceResponse[]> {
    return this.http.get<ResourceResponse[]>(
      `${this.apiUrl}/type/${type}`
    );
  }

  getByCategory(cat: string): Observable<ResourceResponse[]> {
    return this.http.get<ResourceResponse[]>(
      `${this.apiUrl}/category/${cat}`
    );
  }

  createResource(
    data: ResourceRequest
  ): Observable<ResourceResponse> {
    return this.http.post<ResourceResponse>(this.apiUrl, data);
  }

  updateResource(
    id: number,
    data: ResourceRequest
  ): Observable<ResourceResponse> {
    return this.http.put<ResourceResponse>(
      `${this.apiUrl}/${id}`, data
    );
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}