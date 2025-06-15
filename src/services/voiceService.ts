declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

export type RecognitionState = 'idle' | 'listening' | 'processing' | 'error';

export class VoiceService {
  private recognition: SpeechRecognition | null;
  private synthesis: SpeechSynthesis | null;
  private onResult: ((text: string, isFinal: boolean) => void) | null;
  private onStateChange: ((state: RecognitionState) => void) | null;
  private state: RecognitionState;
  private fullTranscript: string;
  private isInitialized: boolean;

  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.onResult = null;
    this.onStateChange = null;
    this.state = 'idle';
    this.fullTranscript = '';
    this.isInitialized = false;

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    if (this.isInitialized) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      this.recognition = new SpeechRecognition();
      this.synthesis = window.speechSynthesis;
      
      if (!this.recognition || !this.synthesis) {
        throw new Error('Speech services not available');
      }

      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.setupEventListeners();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      this.state = 'error';
      this.notifyStateChange();
    }
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      if (!this.onResult) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result || !result[0]) continue;

        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript;
          this.fullTranscript += ' ' + transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentText = this.fullTranscript.trim() + ' ' + interimTranscript;
      this.onResult(currentText, finalTranscript.length > 0);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.handleError(event.error);
    };

    this.recognition.onend = () => {
      if (this.state === 'listening') {
        this.state = 'idle';
        this.notifyStateChange();
      }
    };
  }

  private handleError(error: string) {
    this.state = 'error';
    this.notifyStateChange();

    switch (error) {
      case 'no-speech':
        console.warn('No speech detected');
        break;
      case 'aborted':
        console.warn('Recognition aborted');
        break;
      case 'audio-capture':
        console.error('Audio capture failed');
        break;
      case 'network':
        console.error('Network error occurred');
        break;
      case 'not-allowed':
        console.error('Permission denied');
        break;
      case 'service-not-allowed':
        console.error('Service not allowed');
        break;
      default:
        console.error('Unknown error:', error);
    }
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  startListening(onResult: (text: string, isFinal: boolean) => void, onStateChange?: (state: RecognitionState) => void) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.stopListening();

    this.onResult = onResult;
    this.onStateChange = onStateChange;
    this.fullTranscript = '';
    this.state = 'listening';
    this.notifyStateChange();

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.handleError('start-failed');
    }
  }

  stopListening() {
    if (!this.recognition) return;

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }

    this.state = 'idle';
    this.notifyStateChange();
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      this.state = 'idle';
      this.notifyStateChange();
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.state = 'error';
      this.notifyStateChange();
      if (onEnd) onEnd();
    };

    this.state = 'processing';
    this.notifyStateChange();
    this.synthesis.speak(utterance);
  }

  getState(): RecognitionState {
    return this.state;
  }

  isAvailable(): boolean {
    return this.isInitialized && this.state !== 'error';
  }

  public setContinuousMode(isContinuous: boolean) {
    if (this.recognition) {
      this.recognition.continuous = isContinuous;
    }
  }
} 