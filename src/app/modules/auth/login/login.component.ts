import { Component }          from '@angular/core';
import { CommonModule }       from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
}                             from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService }        from '../../../core/services/auth.service';

@Component({
  selector:    'app-login',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})
export class LoginComponent {

  form:          FormGroup;
  loading      = false;
  error        = '';
  showPass     = false;   // ✅
  emailFocused = false;
  passFocused  = false;

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.authService.saveToken(res.accessToken);
        this.authService.saveRefreshToken(res.refreshToken);
        this.authService.saveUser(res.user);

        const role = res.user?.role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.error   = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}