import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f4f1;">
      <div style="text-align:center;">
        <div class="spinner-border text-success" style="width:3rem;height:3rem;"></div>
        <p style="margin-top:20px;color:#666;font-size:16px;">Connexion en cours...</p>
      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (!code) {
        this.router.navigate(['/login']);
        return;
      }

      this.authService.exchangeCode(code).subscribe({
        next: (response) => {
          const token = response.access_token;
          const decoded = this.authService.decodeToken(token);

          localStorage.setItem('token', token);
          localStorage.setItem('id_token', response.id_token);  // ✅ AJOUTER ICI


          const userData = {
            keycloakId: decoded.sub,
            email: decoded.email,
            firstName: decoded.given_name || decoded.name?.split(' ')[0] || '',
            lastName: decoded.family_name || decoded.name?.split(' ')[1] || ''
          };

          const role = decoded.realm_access?.roles?.includes('ADMIN') ? 'ADMIN' : 'USER';

          localStorage.setItem('user', JSON.stringify({
            ...userData,
            role: role
          }));

          this.authService.syncUser(userData).subscribe({
            next: () => this.router.navigate([role === 'ADMIN' ? '/admin' : '/home']),
            error: () => this.router.navigate(['/home'])
          });
        },
        error: () => this.router.navigate(['/login'])
      });
    });
  }
}