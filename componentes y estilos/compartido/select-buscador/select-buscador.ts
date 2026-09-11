import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, inject, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-select-buscador',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  templateUrl: './select-buscador.html',
})
export class SelectBuscadorComponent implements OnChanges {
  @Input() opciones: { id: any; nombre: string; descripcion?: string; esHijo?: boolean; destacada?: boolean; [key: string]: any }[] = [];
  @Input() placeholder: string = '-- Seleccionar --';
  @Input() disabled: boolean = false;
  @Input() invalido: boolean = false;
  @Input() mostrarTooltip: boolean = false;
  @Input() value: any = null;
  
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  private elementRef = inject(ElementRef);

  busqueda = '';
  dropdownAbierto = false;
  opcionSeleccionada: { id: any; nombre: string; descripcion?: string; esHijo?: boolean; destacada?: boolean; [key: string]: any } | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownAbierto = false;
      this.busqueda = '';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] || changes['opciones']) {
      this.opcionSeleccionada = this.opciones.find(o => o.id === this.value) || null;
    }
  }

  get opcionesFiltradas() {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) return this.opciones;
    return this.opciones.filter((o) => o.nombre.toLowerCase().includes(termino));
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.dropdownAbierto = !this.dropdownAbierto;
    if (this.dropdownAbierto) {
      this.busqueda = '';
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 50);
    }
  }

  onInput(event: Event) {
    if (this.disabled) return;
    this.busqueda = (event.target as HTMLInputElement).value;
    this.dropdownAbierto = true;
  }

  seleccionar(opcion: { id: any; nombre: string; descripcion?: string; esHijo?: boolean; destacada?: boolean; [key: string]: any }) {
    this.opcionSeleccionada = opcion;
    this.busqueda = '';
    this.dropdownAbierto = false;
    this.value = opcion.id;
    this.valueChange.emit(this.value);
  }
}
