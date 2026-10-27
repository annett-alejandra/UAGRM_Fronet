// src/features/verificar-certificado/api/verificarCertificado.ts
import type { VerificarCertificadoResponse } from "@entities/certificado";

export const VERIFICAR_CERTIFICADO_QUERY = `
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

export const VERIFICAR_CERTIFICADO = VERIFICAR_CERTIFICADO_QUERY;

export const useVerificarCertificadoQuery = () => {
  const fetchQuery = async ({ variables }: { variables: { hashQr: string } }) => {
    try {
      const graphqlUrl =
        (import.meta as any).env?.VITE_GRAPHQL_URL || "http://localhost:8000/graphql/";
      const response = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: VERIFICAR_CERTIFICADO_QUERY,
          variables,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        return { data: json.data as VerificarCertificadoResponse };
      }
    } catch {
      // Retorna null para que el hook ejecute su fallback local
    }
    return { data: null };
  };

  return [fetchQuery] as const;
};

