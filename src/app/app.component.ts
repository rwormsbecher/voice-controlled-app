import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { VoiceButtonComponent } from './components/voice-button/voice-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VoiceControlService } from './services/voice-control.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

interface LogEntry {
  id: number;
  message: string;
  timestamp: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    VoiceButtonComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    DatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  logs$: Observable<LogEntry[]>;

  constructor(private voiceControlService: VoiceControlService) {
    this.logs$ = this.voiceControlService.log$;
  }
}
