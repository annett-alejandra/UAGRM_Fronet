import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex relative" (mouseenter)="mostrar($event)" (mouseleave)="ocultar()">
      <ng-content></ng-content>
    </div>

    @if (visible) {
      <div
        class="fixed z-[100] inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm pointer-events-none"
        [style.left.px]="x"
        [style.top.px]="y"
        [style.opacity]="opacity"
        [style.transform]="transformClass"
        role="tooltip"
      >
        {{ text }}
        <div class="absolute w-2 h-2 bg-gray-900 rotate-45" [ngClass]="getArrowClass()"></div>
      </div>
    }
  `
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: TooltipPosition = 'top';

  visible = false;
  opacity = 0;
  x = 0;
  y = 0;
  transformClass = '';
  actualPosition: TooltipPosition = 'top';

  getArrowClass() {
    switch (this.actualPosition) {
      case 'top': return 'bottom-[-4px] left-1/2 -translate-x-1/2';
      case 'bottom': return 'top-[-4px] left-1/2 -translate-x-1/2';
      case 'left': return 'right-[-4px] top-1/2 -translate-y-1/2';
      case 'right': return 'left-[-4px] top-1/2 -translate-y-1/2';
      default: return 'bottom-[-4px] left-1/2 -translate-x-1/2';
    }
  }

  mostrar(event: MouseEvent) {
    if (!this.text) return;
    this.visible = true;
    this.opacity = 0; // Ensure it's invisible while calculating
    this.actualPosition = this.position;
    
    const target = event.currentTarget as HTMLElement;
    
    setTimeout(() => {
      // Usar querySelector para encontrar el tooltip renderizado (hay uno por componente)
      const tooltipEl = target.nextElementSibling as HTMLElement; 
      // O buscar globalmente (menos seguro si hay varios, pero como solo un mouseenter está activo a la vez)
      const tooltips = document.querySelectorAll('[role="tooltip"]');
      const currentTooltip = tooltips[tooltips.length - 1] as HTMLElement;
      
      if (!currentTooltip) {
        this.opacity = 1;
        return;
      }
      
      const rect = target.getBoundingClientRect();
      const tooltipRect = currentTooltip.getBoundingClientRect();
      const gap = 8;
      let pos = this.position;
      
      // Dynamic fallback
      if (pos === 'left' && rect.left - tooltipRect.width - gap < 0) {
        pos = 'right';
      } else if (pos === 'right' && rect.right + tooltipRect.width + gap > window.innerWidth) {
        pos = 'left';
      } else if (pos === 'top' && rect.top - tooltipRect.height - gap < 0) {
        pos = 'bottom';
      } else if (pos === 'bottom' && rect.bottom + tooltipRect.height + gap > window.innerHeight) {
        pos = 'top';
      }
      
      this.actualPosition = pos;

      switch (pos) {
        case 'top':
          this.x = rect.left + rect.width / 2;
          this.y = rect.top - gap;
          this.transformClass = 'translate(-50%, -100%)';
          break;
        case 'bottom':
          this.x = rect.left + rect.width / 2;
          this.y = rect.bottom + gap;
          this.transformClass = 'translate(-50%, 0)';
          break;
        case 'left':
          this.x = rect.left - gap;
          this.y = rect.top + rect.height / 2;
          this.transformClass = 'translate(-100%, -50%)';
          break;
        case 'right':
          this.x = rect.right + gap;
          this.y = rect.top + rect.height / 2;
          this.transformClass = 'translate(0, -50%)';
          break;
      }
      
      // Force repaint to apply transform before opacity to avoid animation jump
      currentTooltip.offsetHeight; 
      this.opacity = 1;
    }, 0);
  }

  ocultar() {
    this.opacity = 0;
    setTimeout(() => {
      this.visible = false;
    }, 300);
  }
}
