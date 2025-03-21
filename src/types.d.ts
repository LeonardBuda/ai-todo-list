interface SpeechRecognition extends EventTarget {
    new (): SpeechRecognition;
    start(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
  }
  
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }
  
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  declare global {
    interface Window {
      SpeechRecognition?: SpeechRecognition;
      webkitSpeechRecognition?: SpeechRecognition;
    }
  }