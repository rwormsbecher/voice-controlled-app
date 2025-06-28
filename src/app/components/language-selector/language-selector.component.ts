import { Component, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-language-selector',
  imports: [MatSelectModule, MatFormFieldModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  activeLanguage = computed(() => this.voiceControlService.language());

  constructor(private voiceControlService: VoiceControlService) {
  }

  setLanguage(language: string) {
    this.voiceControlService.setLanguage(language);
  }
}
