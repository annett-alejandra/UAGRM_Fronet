// src/features/verificar-certificado/api/verificarCertificado.ts
import { gql, useLazyQuery } from "@apollo/client";
import type { VerificarCertificadoResponse } from "@entities/certificado";

export const VERIFICAR_CERTIFICADO = gql`
  query VerificarCertificadoQR($hashQr: String!) {
    verificarCertificadoQR(hashQr: $hashQr) {
      valido
      certificado {
        id
        nroCertificado
        tipo
        familia
        fechaEmision
        estado
        rectorNombre
        secretarioNombre
      }
      motivoInvalidez
    }
  }
`;

export const useVerificarCertificadoQuery = () =>
  useLazyQuery<VerificarCertificadoResponse, { hashQr: String }>(
    VERIFICAR_CERTIFICADO
  );
