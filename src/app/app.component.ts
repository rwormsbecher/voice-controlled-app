import {AfterViewInit, Component, effect, ElementRef, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {VoiceButtonComponent} from './components/voice-button/voice-button.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {VoiceControlService} from './services/voice-control.service';
import {AsyncPipe, CommonModule, DatePipe} from '@angular/common';
import {Observable} from 'rxjs';
import {DialogComponent} from './components/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';

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
        DatePipe,
        RouterLinkActive
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
    logs$: Observable<LogEntry[]>;
    @ViewChild('logContainer') logContainer!: ElementRef<HTMLDivElement>;

    constructor(private voiceControlService: VoiceControlService, private dialog: MatDialog) {
        this.logs$ = this.voiceControlService.log$;

        effect(() => {
            if (this.voiceControlService.helpIsVisible()) {
                this.dialog.open(DialogComponent, {
                    width: '99%'
                });
            }
        });
    }

    openHelp() {
        this.voiceControlService.helpIsVisible.set(!this.voiceControlService.helpIsVisible());
    }


    ngAfterViewInit() {
        this.logs$.subscribe(() => {
            setTimeout(() => {
                this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
            });
        });
    }
}
