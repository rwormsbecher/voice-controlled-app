import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceControlService } from '../../services/voice-control.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-voice-button',
  standalone: true,
  imports: [MatIcon, MatButton, LanguageSelectorComponent],
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isListening = false;

  constructor(
    private voiceService: VoiceControlService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Subscribe to errors
    this.voiceService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.voiceService.stopListening();
  }

  listen() {
    this.isListening = !this.isListening;
    
    if (this.isListening) {
      this.voiceService.startListening();
      this.voiceService.command$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (command: string) => {
            console.log('Voice command:', command);

            if (command.includes('home')) {
              this.router.navigate(['/home']);
            } else if (command.includes('about')) {
              this.router.navigate(['/about']);
            } else if (command.includes('contact')) {
              this.router.navigate(['/contact']);
            }
          },
          error: (error) => {
            console.error('Command error:', error);
            this.isListening = false;
          }
        });
    } else {
      this.voiceService.stopListening();
    }
  }
}