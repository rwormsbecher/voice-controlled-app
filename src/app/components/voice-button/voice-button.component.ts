import {Component, computed, effect, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {VoiceControlService} from '../../services/voice-control.service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LanguageSelectorComponent} from "../language-selector/language-selector.component";
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-voice-button',
    standalone: true,
    imports: [MatIcon, MatButton, LanguageSelectorComponent],
    templateUrl: './voice-button.component.html',
    styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent implements OnInit {
    isListening = computed(() => this.voiceService.isListening());
    error = '';

    constructor(
        private voiceService: VoiceControlService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) {
        // Create an effect to handle command changes
        effect(() => {
            const command = this.voiceService.command();
            if (command) {
                if (command.includes('home') || command.includes('首页')) {
                    this.router.navigate(['/home']);
                } else if (command.includes('about') || command.includes('over ons') || command.includes('关于我们')) {
                    this.router.navigate(['/about']);
                } else if (command.includes('contact') || command.includes('联系')) {
                    this.router.navigate(['/contact']);
                } else if (command.includes('animation') || command.includes('animatie') || command.includes('动画')) {
                    this.router.navigate(['/animation']);
                } else if (command.includes('help me') || command.includes('help mij') || command.includes('帮助我')) {
                    this.voiceService.helpIsVisible.set(true);
                } else if (command.includes('close help') || command.includes('sluit help') || command.includes('关闭帮助')) {
                    this.voiceService.helpIsVisible.set(false);
                    this.dialog.closeAll();
                }
            }
        });
    }

    ngOnInit(): void {
        // Subscribe to error messages
        this.voiceService.error$.subscribe(error => {
            this.error = error;
            if (error) {
                this.voiceService.isListening.set(false);
                this.snackBar.open(error, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                });
            }
        });
    }

    toggleListening() {
        if (this.isListening()) {
            this.voiceService.stopListening();
            this.voiceService.isListening.set(false);
        } else {
            this.voiceService.startListening();
            this.voiceService.isListening.set(true);
        }
    }
}
