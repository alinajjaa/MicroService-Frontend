import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ✅ Auth
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // ✅ Frontoffice USER
  {
    path: 'home',
    loadComponent: () =>
      import('./layouts/frontoffice/frontoffice.component')
        .then(m => m.FrontofficeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
  path: 'profile',
  loadComponent: () =>
    import('./modules/profile/profile.component')
      .then(m => m.ProfileComponent)
},
      {
        path: 'moods',
        loadComponent: () =>
          import('./modules/mood/mood-list/mood-list.component')
            .then(m => m.MoodListComponent)
      },

      // ✅ Meditations USER
      {
        path: 'meditations',
        loadComponent: () =>
          import('./modules/meditation/meditation-list/meditation-list.component')
            .then(m => m.MeditationListComponent)
      },
      {
        path: 'meditations/timer',
        loadComponent: () =>
          import('./modules/meditation/meditation-timer/meditation-timer.component')
            .then(m => m.MeditationTimerComponent)
      },
      {
        path: 'meditations/new',
        loadComponent: () =>
          import('./modules/meditation/meditation-form/meditation-form.component')
            .then(m => m.MeditationFormComponent)
      },
      {
        path: 'meditations/edit/:id',
        loadComponent: () =>
          import('./modules/meditation/meditation-form/meditation-form.component')
            .then(m => m.MeditationFormComponent)
      },

      {
        path: 'resources',
        loadComponent: () =>
          import('./modules/resource/resource-list/resource-list.component')
            .then(m => m.ResourceListComponent)
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./modules/event/event-list/event-list.component')
            .then(m => m.EventListComponent)
      },
{
  path: 'chat',
  loadComponent: () =>
    import('./modules/chat/chat-list/chat-list.component')
      .then(m => m.ChatListComponent)
},
{
  path: 'complaints',
  loadComponent: () =>
    import('./modules/complaint/complaint-list/complaint-list.component')
      .then(m => m.ComplaintListComponent)
}
    ]
  },

  // ✅ Backoffice ADMIN
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/backoffice/backoffice.component')
        .then(m => m.BackofficeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/admin/admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/admin/user-management/user-management.component')
            .then(m => m.UserManagementComponent)
      },

      // ✅ Moods Admin
      {
        path: 'moods',
        loadComponent: () =>
          import('./modules/mood/mood-admin/mood-admin.component')
            .then(m => m.MoodAdminComponent)
      },

      // ✅ Meditations Admin
      {
        path: 'meditations',
        loadComponent: () =>
          import('./modules/meditation/meditation-list/meditation-list.component')
            .then(m => m.MeditationListComponent)
      },
      {
        path: 'meditations/new',
        loadComponent: () =>
          import('./modules/meditation/meditation-form/meditation-form.component')
            .then(m => m.MeditationFormComponent)
      },
      {
        path: 'meditations/edit/:id',
        loadComponent: () =>
          import('./modules/meditation/meditation-form/meditation-form.component')
            .then(m => m.MeditationFormComponent)
      },

      // ✅ Events Admin
      {
        path: 'events',
        loadComponent: () =>
          import('./modules/event/event-list/event-list.component')
            .then(m => m.EventListComponent)
      },
      {
        path: 'events/new',
        loadComponent: () =>
          import('./modules/event/event-form/event-form.component')
            .then(m => m.EventFormComponent)
      },
      {
        path: 'events/edit/:id',
        loadComponent: () =>
          import('./modules/event/event-form/event-form.component')
            .then(m => m.EventFormComponent)
      },

      // ✅ Resources Admin
      {
        path: 'resources',
        loadComponent: () =>
          import('./modules/resource/resource-list/resource-list.component')
            .then(m => m.ResourceListComponent)
      },
      {
        path: 'resources/new',
        loadComponent: () =>
          import('./modules/resource/resource-form/resource-form.component')
            .then(m => m.ResourceFormComponent)
      },
      {
        path: 'resources/edit/:id',
        loadComponent: () =>
          import('./modules/resource/resource-form/resource-form.component')
            .then(m => m.ResourceFormComponent)
      },

      // ✅ Complaints Admin
{
  path: 'complaints',
  loadComponent: () =>
    import('./modules/complaint/complaint-list/complaint-list.component')
      .then(m => m.ComplaintListComponent)
},

      // ✅ Chat Admin
{
  path: 'chat',
  loadComponent: () =>
    import('./modules/chat/chat-list/chat-list.component')
      .then(m => m.ChatListComponent)
}
    ]
  },

  { path: '**', redirectTo: 'login' }
];