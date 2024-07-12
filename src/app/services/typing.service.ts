import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private intervalId: any;
  private currentIdx = 0;
  public animatedResult = '';

  constructor() { }

  animateResult(result: string) {
    const resultArray = result.split('');
    this.currentIdx = 0;
    this.animatedResult = '';

    this.intervalId = setInterval(() => {
      if (this.currentIdx < resultArray.length) {
        this.animatedResult += resultArray[this.currentIdx];
        this.currentIdx++;
      } else {
        clearInterval(this.intervalId);
      }
    }, 50); // Intervalo de tiempo entre cada letra (en milisegundos)
  }

  stopAnimation() {
    clearInterval(this.intervalId);
  }
}