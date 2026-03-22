import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionExpiredComponent } from
  './shared/session-expired/session-expired.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SessionExpiredComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}