import type {
  OrigenSolicitud,
  SolicitudTitulo,
} from "../model/types";

export class TitulosService {
  filtrarSolicitudes(
    solicitudes: SolicitudTitulo[],
    texto: string,
    origen: OrigenSolicitud | "TODOS",
    institucion: string
  ): SolicitudTitulo[] {
    const textoNormalizado =
      texto.trim().toLowerCase();

    return solicitudes.filter((solicitud) => {
      const coincideTexto =
        textoNormalizado === "" ||
        solicitud.ci
          .toLowerCase()
          .includes(textoNormalizado) ||
        solicitud.nombreCompleto
          .toLowerCase()
          .includes(textoNormalizado);

      const coincideOrigen =
        origen === "TODOS" ||
        solicitud.origen === origen;

      const coincideInstitucion =
        origen !== "INSTITUCIONAL" ||
        institucion === "" ||
        institucion === "TODAS" ||
        solicitud.institucion === institucion;

      return (
        coincideTexto &&
        coincideOrigen &&
        coincideInstitucion
      );
    });
  }

  obtenerInstituciones(
    solicitudes: SolicitudTitulo[]
  ): string[] {
    const instituciones = solicitudes
      .filter(
        (solicitud) =>
          solicitud.origen === "INSTITUCIONAL"
      )
      .map(
        (solicitud) =>
          solicitud.institucion
      )
      .filter(
        (institucion): institucion is string =>
          Boolean(institucion)
      );

    return [...new Set(instituciones)].sort();
  }
}