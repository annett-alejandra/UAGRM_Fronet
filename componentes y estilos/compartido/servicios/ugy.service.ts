import { Injectable, signal } from '@angular/core';
import { TourStep } from '../ugy-interactivo/ugy-interactivo.component';

@Injectable({
  providedIn: 'root'
})
export class UgyService {
  private currentSteps = signal<TourStep[]>([]);
  private startRequested = signal<boolean>(false);

  setSteps(steps: TourStep[]) {
    this.currentSteps.set(steps);
  }

  getSteps() {
    return this.currentSteps();
  }

  requestStart() {
    this.startRequested.set(true);
  }

  consumeStartRequest(): boolean {
    const requested = this.startRequested();
    if (requested) {
      this.startRequested.set(false);
    }
    return requested;
  }
}
