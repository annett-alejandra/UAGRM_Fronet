import type {
  DocumentoConvalidacion,
} from "../model/types";

export class ExpedienteConvalidacionService {
  obtenerPorExpediente(
    documentos: DocumentoConvalidacion[],
    expedienteId: string
  ): DocumentoConvalidacion | null {
    return (
      documentos.find(
        (documento) =>
          documento.expedienteId === expedienteId
      ) ?? null
    );
  }

  obtenerCampo(
    documento: DocumentoConvalidacion,
    campoId: string
  ): string {
    return (
      documento.campos.find(
        (campo) =>
          campo.campo === campoId
      )?.valorFinal ?? "Sin información"
    );
  }
}