import {
  Component,
  inject,
  input,
  signal,
  OnDestroy,
  AfterViewInit,
  computed,
  model,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaServicio } from '../../nucleo/service/locales/mapa.servicio';

@Component({
  selector: 'app-mini-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-mapa.html',
  host: { class: 'block w-full' },
})
export class MiniMapa implements AfterViewInit, OnDestroy {
  readonly coordenadas = model<string>('-17.775729246131863, -63.19720036560264'); // Default SCZ
  readonly direccion = input<string>('');
  readonly interactivo = input<boolean>(false);

  private readonly mapaServicio = inject(MapaServicio);
  private mapaInstancia: any = null;

  readonly mapaId = `mapa-leaflet-${Math.random().toString(36).slice(2, 8)}`;
  readonly copiado = signal(false);
  readonly pantallaCompleta = signal(false);

  constructor() {
    // Si cambia coordenadas por fuera, actualizamos el mapa
    effect(() => {
      const coordStr = this.coordenadas();
      if (!coordStr) return; // Evitar procesar si es null o vacío
      if (this.mapaInstancia?.marker && this.mapaInstancia?.mapa) {
        const parsed = this.mapaServicio.parsearCoordenadas(coordStr);
        if (parsed) {
          this.mapaInstancia.marker.setLatLng(parsed);
          this.mapaInstancia.mapa.setView(parsed);
        }
      }
    });
  }

  readonly latLng = computed((): [number, number] | null => {
    const coords = this.coordenadas();
    if (!coords) {
      // Si está interactivo, retornar el campus central por defecto
      return this.interactivo() ? [-17.775729, -63.1972] : null;
    }
    return (
      this.mapaServicio.parsearCoordenadas(coords) ||
      (this.interactivo() ? [-17.775729, -63.1972] : null)
    );
  });

  readonly urlGoogleMaps = computed((): string => {
    const coords = this.latLng();
    if (!coords) return '#';
    return `https://maps.google.com/?q=${coords[0]},${coords[1]}`;
  });

  async ngAfterViewInit(): Promise<void> {
    const coords = this.latLng() || [-17.775729, -63.1972];
    this.mapaInstancia = await this.mapaServicio.inicializar(this.mapaId, coords[0], coords[1]);
    setTimeout(() => this.mapaInstancia?.mapa?.invalidateSize(), 250);

    if (this.interactivo() && this.mapaInstancia?.mapa) {
      // Configurar cursor para modo interactivo
      this.mapaInstancia.mapa.getContainer().style.cursor = 'crosshair';

      this.mapaInstancia.mapa.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.mapaInstancia.marker.setLatLng(e.latlng);
        this.coordenadas.set(`${lat}, ${lng}`);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mapaInstancia) {
      this.mapaServicio.destruir(this.mapaInstancia);
      this.mapaInstancia = null;
    }
  }

  copiarCoordenadas(): void {
    const coords = this.latLng();
    if (!coords) return;
    navigator.clipboard?.writeText(`${coords[0]}, ${coords[1]}`).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }

  togglePantallaCompleta(): void {
    this.pantallaCompleta.update((v) => !v);
    setTimeout(() => this.mapaInstancia?.mapa?.invalidateSize(), 300);
  }
}
