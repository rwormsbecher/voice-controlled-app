import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LogEntry {
  id: number;
  message: string;
  timestamp: number;
}

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
  private logCounter = 0;
  private shouldRestartAfterEnd = false;

  private commandSignal: WritableSignal<string> = signal('');
  private logSubject = new BehaviorSubject<LogEntry[]>([]);
  private errorSubject = new BehaviorSubject<string>('');
  public language = signal<string>("en-US");

  log$ = this.logSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  get command() {
    return this.commandSignal;
  }

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
        this.commandSignal.set(transcript);
        const currentLog = this.logSubject.value;
        const newLogEntry: LogEntry = {
          id: ++this.logCounter,
          message: transcript,
          timestamp: Date.now()
        };
        this.logSubject.next([...currentLog, newLogEntry]);
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
        if (this.shouldRestartAfterEnd) {
          this.shouldRestartAfterEnd = false;
          try {
            this.recognition.start();
          } catch (error) {
            console.error('Failed to restart recognition after language change:', error);
            this.isListening = false;
            this.errorSubject.next('Failed to restart speech recognition after language change');
          }
        } else if (this.isListening) {
          if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
          }
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        this.isListening = true;
        this.errorSubject.next('');
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

  setLanguage(language: string) {
    this.language.set(language);

    const langMap: Record<string, string> = {
      English: 'en-US',
      Dutch: 'nl-NL',
      Chinese: 'zh-CN'
    };

    const langCode = langMap[language] || 'en-US';
    this.recognition.lang = langCode;

    if (this.isListening) {
      this.shouldRestartAfterEnd = true;
      try {
        this.recognition.abort();
      } catch (error) {
        console.error('Error aborting recognition for language switch:', error);
      }
    }
  }
}
