import type {
  LoteInstitucional,
} from "../model/types";

export class LotesService {
  calcularProgreso(
    lote: LoteInstitucional
  ): number {
    if (lote.total <= 0) {
      return 0;
    }

    const porcentaje =
      (lote.procesados / lote.total) * 100;

    return Math.round(porcentaje);
  }

  obtenerTextoProgreso(
    lote: LoteInstitucional
  ): string {
    const porcentaje =
      this.calcularProgreso(lote);

    return `${porcentaje}% procesado (${lote.procesados}/${lote.total})`;
  }

  puedeDespacharse(
    lote: LoteInstitucional
  ): boolean {
    return (
      lote.total > 0 &&
      lote.procesados === lote.total
    );
  }

  obtenerPendientes(
    lote: LoteInstitucional
  ): number {
    return Math.max(
      lote.total - lote.procesados,
      0
    );
  }
  obtenerIntegrantes(
  lote: LoteInstitucional
) {
  return lote.integrantes;
}

puedeDespacharConMensaje(
  lote: LoteInstitucional
): {
  permitido: boolean;
  mensaje: string;
} {
  if (!this.puedeDespacharse(lote)) {
    const pendientes =
      this.obtenerPendientes(lote);

    return {
      permitido: false,
      mensaje:
        `El lote todavía tiene ${pendientes} registro(s) pendiente(s) de procesamiento.`,
    };
  }

  return {
    permitido: true,
    mensaje:
      "El lote está completamente procesado y puede ser enviado a Secretaría General.",
  };
}
}