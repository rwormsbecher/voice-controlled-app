import { Injectable } from '@angular/core';

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

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  startListening(callback: (transcript: string) => void) {
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      callback(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  stopListening() {
    this.recognition.stop();
  }
}