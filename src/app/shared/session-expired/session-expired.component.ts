import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent {

  constructor(public sessionService: SessionService) {}
}