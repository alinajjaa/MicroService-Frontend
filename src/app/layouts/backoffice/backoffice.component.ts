import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="backoffice-wrapper">
      <app-sidebar></app-sidebar>
      <main class="backoffice-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
styles: [`
  .backoffice-wrapper {
    display: flex;
    min-height: 100vh;
  }
  .backoffice-content {
    flex: 1;
    margin-left: 260px;
    background: #f1f5f9;
    padding: 1.5rem;
    transition: margin-left 0.3s;
    overflow-y: auto;      /* ✅ scroll activé */
    height: 100vh;
    box-sizing: border-box;
  }
`]

})
export class BackofficeComponent {}