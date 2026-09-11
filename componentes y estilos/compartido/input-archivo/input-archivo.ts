import { Component, forwardRef, inject, signal, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { PublicacionService } from '../../nucleo/service/publicacion.service';

@Component({
  selector: 'app-input-archivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-archivo.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputArchivoComponent),
      multi: true,
    },
  ],
})
export class InputArchivoComponent implements ControlValueAccessor {
  private publicacionService = inject(PublicacionService);

  @Input() accept: string = '*/*';

  url = signal('');
  subiendo = signal(false);
  errorSubida = signal<string | null>(null);

  esVideo = computed(() => {
    const path = this.url().toLowerCase().split('?')[0];
    return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg') || path.endsWith('.mov');
  });

  esImagen = computed(() => {
    const path = this.url().toLowerCase().split('?')[0];
    return path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.webp') || path.endsWith('.svg');
  });

  // 'url' = modo manual por texto, 'archivo' = modo subida (dropzone)
  modo = signal<'url' | 'archivo'>('url');

  // ControlValueAccessor callbacks
  onChange = (value: string) => {};
  onTouched = () => {};
  isDisabled = false;

  writeValue(value: string): void {
    if (value !== undefined && value !== null) {
      this.url.set(value);
      // Si ya tiene valor y parece una URL externa, o si es la primera vez,
      // podemos decidir el modo inicial. Por ahora mantenemos el modo por defecto o el que el usuario elija.
    } else {
      this.url.set('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setModo(nuevoModo: 'url' | 'archivo') {
    this.modo.set(nuevoModo);
  }

  onUrlInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.url.set(val);
    this.onChange(val);
    this.onTouched();
  }

  onFileSelected(event: Event | FileList) {
    let file: File | null = null;

    if (event instanceof FileList) {
      file = event[0];
    } else {
      const input = event.target as HTMLInputElement;
      file = input.files?.[0] || null;
    }

    if (!file) return;

    if (this.accept !== '*/*') {
      const isAccepted = this.accept.split(',').some((atype) => {
        const t = atype.trim();
        if (t.endsWith('/*')) {
          return file?.type.startsWith(t.substring(0, t.length - 2));
        }
        return file?.type === t || file?.name.toLowerCase().endsWith(t);
      });

      if (!isAccepted) {
        this.errorSubida.set('Tipo de archivo no permitido. Solo: ' + this.accept);
        return;
      }
    }

    this.subiendo.set(true);
    this.errorSubida.set(null);

    // Contexto genérico para assets de páginas
    const context = 'paginas-archivos';

    this.publicacionService.subirArchivo(file, context).subscribe({
      next: (resp) => {
        this.subiendo.set(false);
        this.url.set(resp.url);
        this.onChange(resp.url);
        this.onTouched();
      },
      error: (err) => {
        this.subiendo.set(false);
        this.errorSubida.set('Error al subir el archivo');
        console.error(err);
      },
    });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.onFileSelected(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
