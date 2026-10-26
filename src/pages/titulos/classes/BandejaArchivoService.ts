import type {
  EntradaArchivo,
  EstadoEntradaArchivo,
} from "../types/titulos-gestion.types";

export class BandejaArchivoService {
  filtrarEntradas(
    entradas: EntradaArchivo[],
    texto: string,
    estado:
      | EstadoEntradaArchivo
      | "TODOS"
  ): EntradaArchivo[] {
    const busqueda =
      texto.trim().toLowerCase();

    return entradas.filter((entrada) => {
      const coincideTexto =
        busqueda === "" ||
        entrada.rut
          .toLowerCase()
          .includes(busqueda) ||
        entrada.ci
          .toLowerCase()
          .includes(busqueda) ||
        entrada.nombreCompleto
          .toLowerCase()
          .includes(busqueda);

      const coincideEstado =
        estado === "TODOS" ||
        entrada.estado === estado;

      return (
        coincideTexto &&
        coincideEstado
      );
    });
  }

  contarPendientes(
    entradas: EntradaArchivo[]
  ): number {
    return entradas.filter(
      (entrada) =>
        entrada.estado === "PENDIENTE"
    ).length;
  }

  contarEnRevision(
    entradas: EntradaArchivo[]
  ): number {
    return entradas.filter(
      (entrada) =>
        entrada.estado === "EN_REVISION"
    ).length;
  }

  contarPrioritarios(
    entradas: EntradaArchivo[]
  ): number {
    return entradas.filter(
      (entrada) =>
        entrada.estado === "PRIORITARIO"
    ).length;
  }
}