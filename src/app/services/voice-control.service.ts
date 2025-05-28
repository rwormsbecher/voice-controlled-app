import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
  private restartTimeout: any;

  private commandSubject = new Subject<string>();
  private logSubject = new BehaviorSubject<string[]>([]);
  private errorSubject = new BehaviorSubject<string>('');
  
  command$ = this.commandSubject.asObservable();
  log$ = this.logSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        this.commandSubject.next(transcript);
        const currentLog = this.logSubject.value;
        this.logSubject.next([...currentLog, transcript]);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.errorSubject.next(event.error);
        
        if (event.error === 'not-allowed') {
          this.isListening = false;
          this.errorSubject.next('Microphone permission denied. Please allow microphone access.');
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Clear any existing timeout
          if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
          }
          // Set a new timeout for restart
          this.restartTimeout = setTimeout(() => {
            try {
              this.recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              this.isListening = false;
              this.errorSubject.next('Failed to restart speech recognition');
            }
          }, 300);
        }
      };

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      this.errorSubject.next('Speech recognition initialization failed');
    }
  }

  async startListening() {
    if (!this.isListening) {
      try {
        // Check if we have microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Clean up the test stream
        
        this.isListening = true;
        this.errorSubject.next(''); // Clear any previous errors
        this.recognition.start();
      } catch (error) {
        console.error('Microphone access error:', error);
        this.errorSubject.next('Microphone access denied');
        this.isListening = false;
      }
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }
}