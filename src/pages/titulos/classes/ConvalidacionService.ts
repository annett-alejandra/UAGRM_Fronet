import type {
  CampoConvalidacion,
} from "../types/titulos-gestion.types";

export class ConvalidacionService {
  compararValores(
    valorOCR: string,
    valorBaseDatos: string
  ): boolean {
    return (
      this.normalizar(valorOCR) ===
      this.normalizar(valorBaseDatos)
    );
  }

  actualizarCampo(
    campo: CampoConvalidacion,
    nuevoValor: string
  ): CampoConvalidacion {
    return {
      ...campo,

      valorFinal: nuevoValor,

      coincide: this.compararValores(
        nuevoValor,
        campo.valorBaseDatos
      ),
    };
  }

  tieneDatosDudosos(
    campos: CampoConvalidacion[]
  ): boolean {
    return campos.some(
      (campo) => !campo.coincide
    );
  }

  contarDatosDudosos(
    campos: CampoConvalidacion[]
  ): number {
    return campos.filter(
      (campo) => !campo.coincide
    ).length;
  }

  obtenerCamposDudosos(
    campos: CampoConvalidacion[]
  ): CampoConvalidacion[] {
    return campos.filter(
      (campo) => !campo.coincide
    );
  }

  private normalizar(
    valor: string
  ): string {
    return valor
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }
}