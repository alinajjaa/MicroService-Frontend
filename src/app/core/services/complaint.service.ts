import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ComplaintRequest {
  subject: string;
  description: string;
  userId: string;
  userEmail?: string;
}

export interface ComplaintHistoryItem {
  id: number;
  oldStatus: string;
  newStatus: string;
  comment: string;
  changedBy: string;
  changedAt: string;
}

export interface ComplaintResponse {
  id: number;
  subject: string;
  description: string;
  status: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  createdAt: string;
  updatedAt?: string;
  history: ComplaintHistoryItem[];
}

export interface UpdateStatusRequest {
  status: string;
  comment: string;
  changedBy: string;
}

// ✅ providedIn root obligatoire
@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = `${environment.apiUrl}/complaints`;

  constructor(private http: HttpClient) {}

  getAllComplaints(): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(this.apiUrl);
  }

  getMyComplaints(
    userId: string
  ): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getComplaintById(
    id: number
  ): Observable<ComplaintResponse> {
    return this.http.get<ComplaintResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  createComplaint(
    data: ComplaintRequest
  ): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(
      this.apiUrl, data
    );
  }

  updateStatus(
    id: number,
    data: UpdateStatusRequest
  ): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(
      `${this.apiUrl}/${id}/status`, data
    );
  }

  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}