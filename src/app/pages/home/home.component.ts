import { Component, OnInit, effect, signal } from '@angular/core';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    regionIsVisible = signal(true)
    

    constructor(  private voiceService: VoiceControlService) {
        // Create an effect to handle command changes
        effect(() => {
            const command = this.voiceService.command();
            if (command) {
                // Handle the command here
                console.log('Home received command:', command);
                
                // Add your command handling logic here
                if (command.includes('show region')) {
                    this.regionIsVisible.set(true);
                } else if (command.includes('hide region')) {
                    this.regionIsVisible.set(false);
                } else if (command.includes('去死')) {
                    this.regionIsVisible.set(false);
                }
            }
        });
    }

    ngOnInit(): void {
        // No need for subscription here since we're handling commands in the effect
    }



}
