import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MoodRequest {
  userId: string;        // ✅ string (keycloakId)
  moodLevel: number;
  note: string;
  date: string;
}

export interface MoodResponse {
  id: number;
  userId: string;        // ✅ string (keycloakId)
  userName?: string;
  userEmail?: string;
  moodLevel: number;
  note: string;
  date: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MoodService {

  private apiUrl = `${environment.apiUrl}/moods`;

  constructor(private http: HttpClient) {}

  createMood(data: MoodRequest): Observable<MoodResponse> {
    return this.http.post<MoodResponse>(this.apiUrl, data);
  }

  getMyMoods(userId: string): Observable<MoodResponse[]> {
    return this.http.get<MoodResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getAllMoods(): Observable<MoodResponse[]> {
    return this.http.get<MoodResponse[]>(this.apiUrl);
  }

  updateMood(
    id: number,
    data: MoodRequest
  ): Observable<MoodResponse> {
    return this.http.put<MoodResponse>(
      `${this.apiUrl}/${id}`, data
    );
  }

  deleteMood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}