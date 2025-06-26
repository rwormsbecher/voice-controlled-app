import { Component, OnInit, effect, signal } from '@angular/core';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    regionIsVisible = signal(true)
    
    constructor(  private voiceService: VoiceControlService) {
        effect(() => {
            const command = this.voiceService.command();
            if (command) {
                
                if (command.includes('show region') || command.includes('toon regio') || command.includes('显示')   ) {
                    this.regionIsVisible.set(true);
                } else if (command.includes('hide region') || command.includes('verberg regio') || command.includes('隐藏')) {
                    this.regionIsVisible.set(false);
                }
            }
        });
    }
}
