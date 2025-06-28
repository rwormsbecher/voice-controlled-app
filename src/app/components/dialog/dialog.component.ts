import {Component, computed} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {VoiceControlService} from '../../services/voice-control.service';
import {NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';

@Component({
    selector: 'app-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        NgIf,
        MatTableModule
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    isVisible = computed(() => this.voiceControlService.helpIsVisible());

    constructor(private voiceControlService: VoiceControlService, private dialogRef: MatDialogRef<DialogComponent>) {
    }

    closeDialog() {
        this.voiceControlService.helpIsVisible.set(false);
        this.dialogRef.close();
    }


}
