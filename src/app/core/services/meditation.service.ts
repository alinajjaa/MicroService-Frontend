import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MeditationSession {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number;
  imageUrl: string;
  isActive: boolean;
  createdBy: string; // keycloakId
  userName?: string;
  createdAt: string;
}

export interface MeditationSessionRequest {
  title: string;
  description: string;
  category: string;
  duration: number;
  imageUrl: string;
  isActive: boolean;
  createdBy: string; // keycloakId

}

export interface MeditationHistoryRequest {
  userId: string;
  sessionId: number;
  sessionTitle: string;
  category: string;
  plannedDuration: number;
  actualDuration: number;
  status: string;
}

export interface MeditationHistoryResponse {
  id: number;
  userId: string;
  sessionId: number;
  sessionTitle: string;
  category: string;
  plannedDuration: number;
  actualDuration: number;
  status: string;
  completedAt: string;
  createdAt: string;
}

export interface MeditationStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalMinutes: number;
  completionRate: number;
}

@Injectable({ providedIn: 'root' })
export class MeditationService {

  private sessionsUrl =
    `${environment.apiUrl}/meditation-sessions`;
  private historyUrl =
    `${environment.apiUrl}/meditation-history`;

  constructor(private http: HttpClient) {}

  // ✅ Sessions
  getActiveSessions(): Observable<MeditationSession[]> {
    return this.http.get<MeditationSession[]>(
      `${this.sessionsUrl}/active`
    );
  }

  getAllSessions(): Observable<MeditationSession[]> {
    return this.http.get<MeditationSession[]>(
      this.sessionsUrl
    );
  }

  getSessionsByCategory(
    category: string
  ): Observable<MeditationSession[]> {
    return this.http.get<MeditationSession[]>(
      `${this.sessionsUrl}/category/${category}`
    );
  }

  getSessionById(id: number): Observable<MeditationSession> {
    return this.http.get<MeditationSession>(
      `${this.sessionsUrl}/${id}`
    );
  }

  createSession(
    data: MeditationSessionRequest
  ): Observable<MeditationSession> {
    return this.http.post<MeditationSession>(
      this.sessionsUrl, data
    );
  }

  updateSession(
    id: number,
    data: MeditationSessionRequest
  ): Observable<MeditationSession> {
    return this.http.put<MeditationSession>(
      `${this.sessionsUrl}/${id}`, data
    );
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.sessionsUrl}/${id}`
    );
  }

  // ✅ History
  saveHistory(
    data: MeditationHistoryRequest
  ): Observable<MeditationHistoryResponse> {
    return this.http.post<MeditationHistoryResponse>(
      this.historyUrl, data
    );
  }

  getMyHistory(
    userId: string
  ): Observable<MeditationHistoryResponse[]> {
    return this.http.get<MeditationHistoryResponse[]>(
      `${this.historyUrl}/user/${userId}`
    );
  }

  getMyStats(userId: string): Observable<MeditationStats> {
    return this.http.get<MeditationStats>(
      `${this.historyUrl}/user/${userId}/stats`
    );
  }

  deleteHistory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.historyUrl}/${id}`
    );
  }
}