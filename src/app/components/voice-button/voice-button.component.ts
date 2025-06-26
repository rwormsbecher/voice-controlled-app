import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceControlService } from '../../services/voice-control.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";

@Component({
  selector: 'app-voice-button',
  standalone: true,
  imports: [MatIcon, MatButton, LanguageSelectorComponent],
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent implements OnInit {
  isListening = false;
  error = '';

  constructor(
    private voiceService: VoiceControlService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Create an effect to handle command changes
    effect(() => {
      const command = this.voiceService.command();
      if (command) {
        // Handle the command here if needed
        console.log('Voice button received command:', command);

        if (command.includes('home')) {
          this.router.navigate(['/home']);
        } else if (command.includes('about')) {
          this.router.navigate(['/about']);
        } else if (command.includes('contact')) {
          this.router.navigate(['/contact']);
        } else if (command.includes('animation')) {
          this.router.navigate(['/animation']);
        }
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to error messages
    this.voiceService.error$.subscribe(error => {
      this.error = error;
      if (error) {
        this.isListening = false;
        this.snackBar.open(error, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  toggleListening() {
    if (this.isListening) {
      this.voiceService.stopListening();
      this.isListening = false;
    } else {
      this.voiceService.startListening();
      this.isListening = true;
    }
  }
}