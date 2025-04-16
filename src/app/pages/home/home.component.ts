import { Component, OnInit, signal } from '@angular/core';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    constructor(  private voiceService: VoiceControlService) {}
    regionIsVisible = signal(true)
    

    ngOnInit(): void {
        this.voiceService.command$.subscribe((command: string) => {
          console.log('started listening in home component.');
         

          if (command.includes('hide region')) {
            console.log('region hidden');
            this.regionIsVisible.set(false);
          } else if (command.includes('show region')) {
            this.regionIsVisible.set(true);
          
          } else if (command.includes('去死')) {
            this.regionIsVisible.set(false);
          }
          
        });
    }



}
