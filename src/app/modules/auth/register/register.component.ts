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
  selector:    'app-register',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls:   ['./register.component.scss']
})
export class RegisterComponent {

  form:      FormGroup;
  loading  = false;
  error    = '';
  success  = '';
  showPass = false;    // ✅
  strength = '';       // ✅

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     ['', Validators.required],
      password:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ✅
  checkStrength(): void {
    const v = this.form.get('password')?.value || '';

    if (!v) { this.strength = ''; return; }

    const isStrong = v.length >= 8
      && /[A-Z]/.test(v)
      && /[0-9]/.test(v)
      && /[^a-zA-Z0-9]/.test(v);

    const isMedium = v.length >= 6
      && (/[A-Z]/.test(v) || /[0-9]/.test(v));

    if (isStrong)      this.strength = 'strong';
    else if (isMedium) this.strength = 'medium';
    else               this.strength = 'weak';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';
    this.success = '';

    const data = { ...this.form.value, role: 'USER' };

    this.authService.register(data).subscribe({
      next: () => {
        this.success = 'Compte créé ! Redirection...';
        this.loading = false;
        setTimeout(() =>
          this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.error   = 'Erreur lors de la création du compte';
        this.loading = false;
      }
    });
  }
}