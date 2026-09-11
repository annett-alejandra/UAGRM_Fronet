import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  inject,
  NgZone,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { driver, Driver, Config } from 'driver.js';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UgyService } from '../servicios/ugy.service';

export interface TourStep {
  element?: string;
  popover: {
    titleRef?: string;
    title: string;
    description: string;
    side?: 'top' | 'left' | 'right' | 'bottom';
    align?: 'start' | 'center' | 'end';
  };
  narration?: string;
}

@Component({
  selector: 'app-ugy-interactivo',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <!-- Modo Narración Activa (Globo / Status) -->
    <div
      *ngIf="isNarrationActive"
      cdkDrag
      class="fixed bottom-8 left-8 z-[9999] cursor-move flex flex-col items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10"
      title="Puedes arrastrarme"
    >
      <!-- Mascot Container -->
      <div [class.ugy-talking-active]="isTalking" class="relative group">
        <!-- Status Indicator -->
        <div *ngIf="isTalking" class="absolute -top-2 -right-2 flex gap-1">
          <span class="w-2 h-4 bg-secundario rounded-full animate-bounce"></span>
          <span
            class="w-2 h-6 bg-primario rounded-full animate-bounce [animation-delay:0.2s]"
          ></span>
          <span
            class="w-2 h-4 bg-secundario rounded-full animate-bounce [animation-delay:0.4s]"
          ></span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class UgyInteractivoComponent implements OnDestroy {
  private zone = inject(NgZone);
  private ugyService = inject(UgyService);

  @Input() set steps(value: TourStep[]) {
    if (value && value.length > 0) {
      this.tourSteps.set(value);
    }
  }

  @Output() tourEnded = new EventEmitter<void>();

  tourSteps = signal<TourStep[]>([]);
  isNarrationActive = false;
  isTalking = false;
  currentMessage = '';
  private driverObj?: Driver;
  private synthesis = window.speechSynthesis;
  private currentUtterance?: SpeechSynthesisUtterance;

  constructor() {
    // Forzar la carga de voces (necesario en Chromium)
    this.synthesis.getVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.synthesis.getVoices();
    }

    effect(() => {
      const globalSteps = this.ugyService.getSteps();
      if (globalSteps.length > 0) {
        this.tourSteps.set(globalSteps);
      }
      
      if (this.ugyService.consumeStartRequest()) {
        setTimeout(() => this.startRecommendedTour(), 0);
      }
    });
  }

  ngOnDestroy() {
    this.stopNarration();
    if (this.driverObj) this.driverObj.destroy();
  }

  startTour(customSteps?: TourStep[]) {
    const activeSteps = customSteps || this.tourSteps();
    if (activeSteps.length === 0) return;

    this.isNarrationActive = true;

    this.driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(28, 55, 102, 0.4)',
      onDeselected: () => this.stopNarration(),
      onDestroyed: () => {
        this.isNarrationActive = false;
        this.stopNarration();
        this.tourEnded.emit();
      },
      onHighlightStarted: (element, step) => {
        const matchingStep = activeSteps.find((s: TourStep) => s.element === step.element);
        if (matchingStep) {
          this.narrate(matchingStep.narration || matchingStep.popover.description);
        }
      },
      steps: activeSteps.map((s: TourStep) => ({
        element: s.element,
        popover: {
          title: s.popover.title,
          description: s.popover.description,
          side: s.popover.side,
          align: s.popover.align,
        },
      })) as Config['steps'],
    });

    this.driverObj.drive();
  }

  startRecommendedTour() {
    if (this.tourSteps().length > 0) {
      this.startTour();
    } else {
      this.startTour([
        {
          popover: {
            title: '¡Hola! Soy Ugy',
            description:
              'Bienvenido al sistema. Estoy aquí para ayudarte a navegar e interactuar con el portal.',
          },
          narration:
            '¡Hola! Soy Ugui. Bienvenido al sistema. Estoy aquí para ayudarte a manejar tus interfaces fácilmente.',
        },
      ]);
    }
  }

  private narrate(text: string) {
    this.stopNarration();

    // Phonetic correction for Ugy
    const correctedText = text.replace(/Ugy/g, 'Ugui');
    this.currentMessage = text;

    this.zone.runOutsideAngular(() => {
      this.currentUtterance = new SpeechSynthesisUtterance(correctedText);
      this.currentUtterance.lang = 'es-ES';
      this.currentUtterance.pitch = 1.6;
      this.currentUtterance.rate = 1.05;

      // Try to find a nice Spanish voice
      let voices = this.synthesis.getVoices();
      const preferredVoices = ['Google Spanish', 'Laura', 'Helena', 'Monica', 'Paulina'];
      let voice = voices.find((v) => preferredVoices.some((p) => v.name.includes(p)));
      
      // Fallback a cualquier voz en español si no encuentra las preferidas
      if (!voice) {
        voice = voices.find((v) => v.lang.startsWith('es'));
      }

      if (voice) this.currentUtterance.voice = voice;

      this.currentUtterance.onstart = () => {
        this.zone.run(() => (this.isTalking = true));
      };

      this.currentUtterance.onend = () => {
        this.zone.run(() => {
          this.isTalking = false;
          // Keep message for a while then clear
          setTimeout(() => {
            if (!this.isTalking) this.currentMessage = '';
          }, 2000);
        });
      };

      this.synthesis.speak(this.currentUtterance);
    });
  }

  private stopNarration() {
    this.synthesis.cancel();
    this.isTalking = false;
    this.currentMessage = '';
  }

  toggleMenu() {
    // Optional: add a menu for Ugy (Restart tour, Mute, Close)
  }
}
