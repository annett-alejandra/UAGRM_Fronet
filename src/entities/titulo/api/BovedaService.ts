import type {
  RegistroBoveda,
} from "../model/types";

export class BovedaService {
  private readonly clave =
    "titulos_boveda_historica";

  obtenerRegistros(): RegistroBoveda[] {
    const datos =
      localStorage.getItem(
        this.clave
      );

    if (!datos) {
      return [];
    }

    try {
      return JSON.parse(
        datos
      ) as RegistroBoveda[];
    } catch {
      return [];
    }
  }

  guardarRegistro(
    registro: RegistroBoveda
  ): void {
    const actuales =
      this.obtenerRegistros();

    const sinDuplicado =
      actuales.filter(
        (item) =>
          item.expedienteId !==
          registro.expedienteId
      );

    const nuevos = [
      registro,
      ...sinDuplicado,
    ];

    localStorage.setItem(
      this.clave,
      JSON.stringify(nuevos)
    );
  }

  filtrar(
    registros: RegistroBoveda[],
    texto: string
  ): RegistroBoveda[] {
    const busqueda =
      texto.trim().toLowerCase();

    if (!busqueda) {
      return registros;
    }

    return registros.filter(
      (registro) =>
        registro.expedienteId
          .toLowerCase()
          .includes(busqueda) ||
        registro.rut
          .toLowerCase()
          .includes(busqueda) ||
        registro.ci
          .toLowerCase()
          .includes(busqueda) ||
        registro.titular
          .toLowerCase()
          .includes(busqueda) ||
        registro.ubicacion
          .toLowerCase()
          .includes(busqueda)
    );
  }
}