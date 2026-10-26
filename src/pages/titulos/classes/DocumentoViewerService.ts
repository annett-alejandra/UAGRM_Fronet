export class DocumentoViewerService {
  aumentarZoom(zoomActual: number): number {
    return Math.min(zoomActual + 0.1, 2);
  }

  disminuirZoom(zoomActual: number): number {
    return Math.max(zoomActual - 0.1, 0.5);
  }

  rotarDerecha(rotacionActual: number): number {
    return rotacionActual + 90;
  }

  rotarIzquierda(rotacionActual: number): number {
    return rotacionActual - 90;
  }

  alternarContraste(contrasteActual: boolean): boolean {
    return !contrasteActual;
  }

restablecerVista(): {
  zoom: number;
  rotacion: number;
  contraste: boolean;
} {
  return {
    zoom: 0.8,
    rotacion: 0,
    contraste: false,
  };
}
}