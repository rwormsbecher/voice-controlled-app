import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceButtonComponent } from './components/voice-button/voice-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VoiceButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'voice-controlled-app';
}
