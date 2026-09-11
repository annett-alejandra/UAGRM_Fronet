import {
  Component,
  inject,
  input,
  signal,
  OnDestroy,
  AfterViewInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaServicio } from '../../../nucleo/service/locales/mapa.servicio';


@Component({
  selector: 'app-mini-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-mapa.html',
  host: { class: 'block w-full' },
})
export class MiniMapa implements AfterViewInit, OnDestroy {
  readonly coordenadas = input.required<string>();
  readonly direccion = input<string>('');

  private readonly mapaServicio = inject(MapaServicio);
  private mapaInstancia: any = null;

  readonly mapaId = `mapa-leaflet-${Math.random().toString(36).slice(2, 8)}`;
  readonly copiado = signal(false);

  readonly latLng = computed((): [number, number] | null =>
    this.mapaServicio.parsearCoordenadas(this.coordenadas()),
  );

  readonly urlGoogleMaps = computed((): string => {
    const coords = this.latLng();
    if (!coords) return '#';
    return `https://maps.google.com/?q=${coords[0]},${coords[1]}`;
  });

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    const coords = this.latLng();
    if (!coords) return;
    this.mapaInstancia = await this.mapaServicio.inicializar(this.mapaId, coords[0], coords[1]);
    setTimeout(() => this.mapaInstancia?.invalidateSize(), 250);
  }

  ngOnDestroy(): void {
    if (this.mapaInstancia) {
      this.mapaServicio.destruir(this.mapaInstancia);
      this.mapaInstancia = null;
    }
  }

  copiarCoordenadas(): void {
    if (typeof navigator === 'undefined') return;
    const coords = this.latLng();
    if (!coords) return;
    navigator.clipboard?.writeText(`${coords[0]}, ${coords[1]}`).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }
}
