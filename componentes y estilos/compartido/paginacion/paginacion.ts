import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginacion.html',
})
export class PaginacionComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Páginas del centro para la ventana deslizante (cuando hay > 7 páginas)
  get middlePages(): number[] {
    const start = Math.max(2, this.currentPage - 2);
    const end   = Math.min(this.totalPages - 1, this.currentPage + 2);
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }

  // "Mostrando X–Y de Z" — el máximo no puede superar totalItems
  get hasta(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  goTo(page: number, event?: Event) {
    event?.preventDefault();
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}