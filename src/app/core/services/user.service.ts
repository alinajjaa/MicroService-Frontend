import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserResponse {
  id:         number;
  keycloakId: string;
  username:   string;
  email:      string;
  firstName:  string;
  lastName:   string;
  phone:      string;
  role:       string;
  createdAt:  string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // ✅ Utilise environment au lieu du hardcode
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // ✅ Get All
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  // ✅ Get All — accessible par users connectés
  getAllUsersList(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${this.apiUrl}/list`
    );
  }

  // ✅ Get By Keycloak ID
  getUserByKeycloakId(
    keycloakId: string
  ): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}/keycloak/${keycloakId}`
    );
  }

  // ✅ Get By ID
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // ✅ Update — URL corrigée (sans double /users/)
  updateUser(
    id: number,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`, data
    );
  }

  // ✅ Change Password
  changePassword(
    id: number,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}/password`, data
    );
  }

  // ✅ Delete
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
