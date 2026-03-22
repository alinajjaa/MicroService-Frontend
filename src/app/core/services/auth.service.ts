import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Router }      from '@angular/router';
import { Observable }  from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  email:     string;
  firstName: string;
  lastName:  string;
  phone:     string;
  password:  string;
  role:      string;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface UserInfo {
  id:         number;
  keycloakId: string;
  email:      string;
  firstName:  string;
  lastName:   string;
  phone?:     string;
  role:       string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
  tokenType:    string;
  user:         UserInfo;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}

  // ✅ Register
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/users/register`, data
    );
  }

  // ✅ Login
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/users/login`, data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ✅ Logout
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(
        `${this.apiUrl}/users/logout`,
        { refreshToken }
      ).subscribe();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // ✅ Save access token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ✅ Save refresh token
  saveRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  // ✅ Save user
  saveUser(user: UserInfo): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // ✅ Get access token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // ✅ Get user
  getUser(): UserInfo | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  // ✅ Alias
  getCurrentUser(): UserInfo | null {
    return this.getUser();
  }

  // ✅ Checks
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string {
    return this.getUser()?.role || '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  isCoach(): boolean {
    return this.getRole() === 'COACH';
  }
}