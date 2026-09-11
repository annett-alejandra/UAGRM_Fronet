import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './tabla-wrapper.html',
})
export class TablaWrapper {
  @Input() cargando = false;
  @Input() mostrarPaginacion = false;
}
