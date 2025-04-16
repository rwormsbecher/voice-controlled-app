import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-voice-button',
  standalone: true,
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent {
  constructor(
    private voiceService: VoiceControlService,
    private router: Router
  ) {}

  listen() {
    this.voiceService.startListening((command: string) => {
      console.log('Voice command:', command);

      if (command.includes('home')) {
        this.router.navigate(['/home']);
      } else if (command.includes('about')) {
        this.router.navigate(['/about']);
      } else if (command.includes('contact')) {
        this.router.navigate(['/contact']);
      } else {
        alert(`Unknown command: "${command}"`);
      }
    });
  }
}