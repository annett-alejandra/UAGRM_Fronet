import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GestorSesionesComponent } from '../../../modulos/publicaciones/formularios/gestor-sesiones/gestor-sesiones';

export interface TipoCampoOption {
  valor: string;
  etiqueta: string;
  descripcion: string;
  icono: string;
}

export interface ClaveCatalogo {
  key: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
  textoOpcion?: string;
  opciones?: Array<{ id: number; nombre: string }>;
}

export interface CampoEsquemaData {
  key: string;
  nombre: string;
  tipo: string;
  requerido?: boolean;
  esSistema?: boolean;
  textoOpcion?: string;
  opciones?: Array<{ id: number; nombre: string }>;
}

@Component({
  selector: 'app-datos-dinamicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GestorSesionesComponent],
  templateUrl: './datos-dinamicos.html',
})
export class DatosDinamicosComponent {
  private fb = inject(FormBuilder);

  @Input() camposFormArray!: FormArray;
  @Input() clavesDelSistema: ClaveCatalogo[] = [];
  @Input() tienePublicaciones = false;
  @Input() tourPrefix = ''; // e.g., 'crear-tipo', 'editar-tipo'
  @Input() formularioId: number | null = null;

  mostrarCatalogo = false;

  readonly tiposCampo: TipoCampoOption[] = [
    {
      valor: 'string',
      etiqueta: 'Texto ',
      descripcion: 'Texto libre (nombres, títulos)',
      icono: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
    },
    {
      valor: 'number',
      etiqueta: 'Número',
      descripcion: 'Números enteros o decimales',
      icono: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
    },
    {
      valor: 'boolean',
      etiqueta: 'Checkbox (Sí/No)',
      descripcion: 'Valor verdadero o falso',
      icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      valor: 'date',
      etiqueta: 'Fecha',
      descripcion: 'Solo fecha (Ej: 25/12/2025)',
      icono: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      valor: 'datetime',
      etiqueta: 'Fecha y Hora',
      descripcion: 'Fecha con hora (Ej: 25/12/2025 14:30)',
      icono: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      valor: 'array',
      etiqueta: 'Lista (Array clásico)',
      descripcion: 'Compatible por retrocompatibilidad',
      icono: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    },
    {
      valor: 'radio',
      etiqueta: 'Opciones (Única)',
      descripcion: 'Lista de opciones donde solo se elige una (Radio Buttons)',
      icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      valor: 'checkbox-group',
      etiqueta: 'Opciones (Múltiple)',
      descripcion: 'Lista de opciones donde se pueden elegir varias (Checkboxes)',
      icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    },
    {
      valor: 'select',
      etiqueta: 'Desplegable',
      descripcion: 'Lista de opciones en un menú desplegable',
      icono: 'M8 9l4-4 4 4m0 6l-4 4-4-4',
    },
  ];

  get campos(): CampoEsquemaData[] {
    return this.camposFormArray.getRawValue() as CampoEsquemaData[];
  }

  getOpcionesFormArray(campoIndex: number): FormArray {
    return this.camposFormArray.at(campoIndex).get('opciones') as FormArray;
  }

  toggleCatalogo() {
    this.mostrarCatalogo = !this.mostrarCatalogo;
  }

  claveYaAgregada(key: string): boolean {
    return this.campos.some(c => c.key === key);
  }

  agregarDesdeCatalogo(clave: ClaveCatalogo) {
    if (this.claveYaAgregada(clave.key)) return;
    
    const campo = this.fb.group({
      key: [{value: clave.key, disabled: this.tienePublicaciones}, Validators.required],
      nombre: [clave.nombre, Validators.required],
      tipo: [{value: clave.tipo, disabled: this.tienePublicaciones}, Validators.required],
      requerido: [false],
      esSistema: [true],
      textoOpcion: [clave.textoOpcion || ''],
      opciones: this.fb.array((clave.opciones || []).map((o) => this.fb.group({ id: [o.id], nombre: [o.nombre] }))),
    });
    
    // Insert after other system keys
    const idx = this.campos.findIndex(c => !c.esSistema);
    if (idx === -1) {
      this.camposFormArray.push(campo);
    } else {
      this.camposFormArray.insert(idx, campo);
    }
  }

  agregarCampo() {
    const campo = this.fb.group({
      key: ['', Validators.required],
      nombre: ['', Validators.required],
      tipo: ['string', Validators.required],
      requerido: [false],
      esSistema: [false],
      textoOpcion: [''],
      opciones: this.fb.array([]),
    });
    this.camposFormArray.push(campo);
  }

  eliminarCampo(index: number) {
    this.camposFormArray.removeAt(index);
  }

  generarKey(index: number) {
    const ctrl = this.camposFormArray.at(index);
    const campo = ctrl.getRawValue() as CampoEsquemaData;
    if (campo.nombre && !campo.key && !this.campoBloqueado(index) && !campo.esSistema) {
      const key = campo.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_');
      ctrl.get('key')?.setValue(key);
    }
  }

  alCambiarTipoDato(index: number) {
    const ctrl = this.camposFormArray.at(index);
    const tipo = ctrl.get('tipo')?.value;
    if (['array', 'radio', 'checkbox-group', 'select'].includes(tipo)) {
      const opciones = this.getOpcionesFormArray(index);
      if (opciones.length === 0) {
        this.agregarOpcion(index);
      }
    }
  }

  agregarOpcion(campoIndex: number) {
    const opciones = this.getOpcionesFormArray(campoIndex);
    const rawOpciones = opciones.getRawValue() as Array<{ id: number }>;
    const maxId = rawOpciones.length > 0 ? Math.max(...rawOpciones.map((o) => o.id)) : 0;
    opciones.push(this.fb.group({
      id: [maxId + 1],
      nombre: ['', Validators.required],
    }));
  }

  eliminarOpcion(campoIndex: number, opcionIndex: number) {
    this.getOpcionesFormArray(campoIndex).removeAt(opcionIndex);
  }

  campoBloqueado(index: number): boolean {
    const campo = this.camposFormArray.at(index).getRawValue();
    // Si tiene publicaciones y no es un campo nuevo (es decir, ya tiene _esOriginal o key bloqueada), o simplemente:
    // Por simplicidad, si la key está deshabilitada.
    return this.tienePublicaciones && this.camposFormArray.at(index).get('key')?.disabled === true;
  }

  obtenerEtiquetaTipo(tipo: string): string {
    return this.tiposCampo.find((t) => t.valor === tipo)?.etiqueta || tipo;
  }

  obtenerDescripcionTipo(tipo: string): string {
    return this.tiposCampo.find((t) => t.valor === tipo)?.descripcion || 'Selecciona un tipo';
  }
}
