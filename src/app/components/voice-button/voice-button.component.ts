import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceControlService } from '../../services/voice-control.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";

@Component({
  selector: 'app-voice-button',
  standalone: true,
  imports: [MatIcon, MatButton, LanguageSelectorComponent],
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent {
  constructor(
    private voiceService: VoiceControlService,
    private router: Router
  ) {}

  listen() {
   this.voiceService.startListening();
    this.voiceService.command$.subscribe((command: string) => {
      console.log('started listening on voice button')
      console.log('Voice command:', command);

      if (command.includes('home')) {
        this.router.navigate(['/home']);
      } else if (command.includes('about')) {
        this.router.navigate(['/about']);
      } else if (command.includes('contact')) {
        this.router.navigate(['/contact']);
      } 

      console.log('command to log', command)
    });
  }
}