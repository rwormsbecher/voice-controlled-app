import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class VoiceControlService {
  private recognition: any;
  private isListening = false;

  private commandSubject = new Subject<string>();
  command$ = this.commandSubject.asObservable(); 

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'zh-CN';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();

      // publish to all subscribers.
      this.commandSubject.next(transcript); 
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        setTimeout(() => this.recognition.start(), 200);
      }
    };
  }

  startListening() {
    if (!this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopListening() {
    this.isListening = false;
    this.recognition.stop();
  }
}