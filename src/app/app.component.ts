import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionExpiredComponent } from './shared/session-expired/session-expired.component';
import { ChatbotComponent } from './shared/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SessionExpiredComponent, ChatbotComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}