import { HttpInterceptorFn } from '@angular/common/http';
import { inject }            from '@angular/core';
import { AuthService }       from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token       = authService.getToken();

  const publicUrls = [
    '/users/register',
    '/users/login'
  ];

  const isPublic = publicUrls.some(url => req.url.includes(url));

  // ── Debug clair ──────────────────────────────────────
  console.group(`🌐 HTTP ${req.method} → ${req.url}`);
  console.log('🔑 Token exists :', !!token);
  console.log('🌍 Public route  :', isPublic);

  if (isPublic) {
    console.log('✅ Route publique — pas de token requis');
    console.groupEnd();
    return next(req);
  }

  if (!token) {
    console.warn('⚠️ Route protégée mais pas de token — rediriger ?');
    console.groupEnd();
    return next(req);
  }

  console.log('🔒 Route protégée — token ajouté');
  console.groupEnd();
  // ─────────────────────────────────────────────────────

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};