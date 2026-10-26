// src/features/verificar-certificado/api/verificarCertificado.ts
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
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
