// src/features/flujo-ocr/api/ocrQueries.ts
const gql = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");

export const GET_DOCUMENTOS_PENDIENTES = gql`
  query GetDocumentosPendientes($moduloOrigen: String) {
    documentosPendientes(moduloOrigen: $moduloOrigen) {
      id
      objectKey
      estado
      fechaSubida
      documentClass
      ocrGuesses
    }
  }
`;

export const VALIDAR_Y_CONSOLIDAD = gql`
  mutation ValidarYConsolidar($id: UUID!, $datosCorregidos: GenericScalar!) {
    validarYConsolidarDocumento(id: $id, datosCorregidos: $datosCorregidos) {
      documento {
        id
        estado
        objectKey
      }
      urlPdfInforme
    }
  }
`;

export const DEVOLVER_DOCUMENTO = gql`
  mutation DevolverDocumento($id: UUID!, $motivo: String!) {
    devolverPorDeficiencia(id: $id, motivo: $motivo) {
      documento {
        id
        estado
        motivoDevolucion
      }
    }
  }
`;

export const INICIAR_TRAMITE = gql`
  mutation IniciarTramite($ci: String!, $nroRecibo: String!) {
    iniciarTramite(ci: $ci, nroRecibo: $nroRecibo) {
      exito
      mensaje
      rutaSugerida
    }
  }
`;
