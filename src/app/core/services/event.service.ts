import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EventRequest {
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  maxParticipants: number;
  imageUrl?: string;
  createdBy?: string;
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  imageUrl?: string;
  createdBy?: string;
  creatorName?: string;
  eventDate: string;
  maxParticipants: number;
  currentParticipants: number;
  availablePlaces: number;
  isFull: boolean;
  participantIds: string[];
  averageRating: number;
  totalRatings: number;
  userIsRegistered: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  userId: string;
  userName: string;
}

export interface RatingRequest {
  userId: string;
  rating: number;
  comment: string;
}

export interface StatusRequest {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {

  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAllEvents(userId?: string): Observable<EventResponse[]> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    return this.http.get<EventResponse[]>(
      this.apiUrl, { params }
    );
  }

  getEventById(
    id: number, userId?: string
  ): Observable<EventResponse> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    return this.http.get<EventResponse>(
      `${this.apiUrl}/${id}`, { params }
    );
  }

  getMyEvents(userId: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(
      `${this.apiUrl}/my/${userId}`
    );
  }

  getByCategory(
    category: string, userId?: string
  ): Observable<EventResponse[]> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    return this.http.get<EventResponse[]>(
      `${this.apiUrl}/category/${category}`, { params }
    );
  }

  createEvent(data: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.apiUrl, data);
  }

  updateEvent(
    id: number, data: EventRequest
  ): Observable<EventResponse> {
    return this.http.put<EventResponse>(
      `${this.apiUrl}/${id}`, data
    );
  }

  updateStatus(
    id: number, data: StatusRequest
  ): Observable<EventResponse> {
    return this.http.put<EventResponse>(
      `${this.apiUrl}/${id}/status`, data
    );
  }

  register(
    id: number, data: RegisterRequest
  ): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      `${this.apiUrl}/${id}/register`, data
    );
  }

  unregister(
    id: number, userId: string
  ): Observable<EventResponse> {
    return this.http.delete<EventResponse>(
      `${this.apiUrl}/${id}/register/${userId}`
    );
  }

  rateEvent(
    id: number, data: RatingRequest
  ): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      `${this.apiUrl}/${id}/rate`, data
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}