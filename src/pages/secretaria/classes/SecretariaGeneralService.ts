import type {
  EstadoSecretariaGeneral,
  RegistroSecretariaGeneral,
} from "../types/dev3.types";

export type FiltroEstadoSecretaria =
  | EstadoSecretariaGeneral
  | "TODOS";

export class SecretariaGeneralService {
  filtrar(
    registros: RegistroSecretariaGeneral[],
    texto: string,
    estado: FiltroEstadoSecretaria
  ): RegistroSecretariaGeneral[] {
    const busqueda =
      texto.trim().toLowerCase();

    return registros.filter(
      (registro) => {
        const coincideTexto =
          busqueda === "" ||
          registro.rut
            .toLowerCase()
            .includes(busqueda) ||
          registro.ci
            .toLowerCase()
            .includes(busqueda) ||
          registro.nombreCompleto
            .toLowerCase()
            .includes(busqueda) ||
          registro.carrera
            .toLowerCase()
            .includes(busqueda);

        const coincideEstado =
          estado === "TODOS" ||
          registro.estado === estado;

        return (
          coincideTexto &&
          coincideEstado
        );
      }
    );
  }

  contarTodos(
    registros: RegistroSecretariaGeneral[]
  ): number {
    return registros.length;
  }

  contarPendientes(
    registros: RegistroSecretariaGeneral[]
  ): number {
    return this.contarPorEstado(
      registros,
      "PENDIENTE"
    );
  }

  contarAprobados(
    registros: RegistroSecretariaGeneral[]
  ): number {
    return this.contarPorEstado(
      registros,
      "APROBADO"
    );
  }

  contarRechazados(
    registros: RegistroSecretariaGeneral[]
  ): number {
    return this.contarPorEstado(
      registros,
      "RECHAZADO"
    );
  }

  private contarPorEstado(
    registros: RegistroSecretariaGeneral[],
    estado: EstadoSecretariaGeneral
  ): number {
    return registros.filter(
      (registro) =>
        registro.estado === estado
    ).length;
  }
}