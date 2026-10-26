// src/views/VistaEmisionPlantillas/components/PlantillaInformeArchivo.tsx
import * as React from "react";
import type { DatosInformeArchivo } from "@/shared/types/plantillas.types";
import { EscudoUagrmSvg } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

export interface PlantillaInformeArchivoProps {
  datos: DatosInformeArchivo;
  resaltarVariables?: boolean;
}

/**
 * Plantilla Oficial Estandarizada: Informe Técnico de Custodia Documental (Archivo Central)
 * Tabla de custodia física de 9 columnas cotejada con Libros Matrices (Págs. 1, 3, 7, 9)
 */
export const PlantillaInformeArchivo: React.FC<PlantillaInformeArchivoProps> = ({
  datos,
  resaltarVariables = false,
}) => {
  const V: React.FC<{ children: React.ReactNode; etiqueta?: string }> = ({ children, etiqueta }) => (
    <span
      title={etiqueta}
      className={cn(
        "font-semibold",
        resaltarVariables && "bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 border border-emerald-300"
      )}
    >
      {children}
    </span>
  );

  const fila = datos.tablaCustodia;

  return (
    <div className="flex flex-col justify-between h-full min-h-[235mm] text-slate-900 leading-relaxed text-justify">
      {/* 1. ENCABEZADO DE ARCHIVO CENTRAL */}
      <div>
        <header className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-center space-x-4">
            <EscudoUagrmSvg size={65} />
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-950 uppercase font-serif">
                Universidad Autónoma &quot;Gabriel René Moreno&quot;
              </h1>
              <p className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                Departamento de Títulos y Archivo Central
              </p>
              <p className="text-[11px] text-slate-600 font-mono uppercase">
                Sección Archivo Central
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 border border-slate-900 rounded block">
              <V etiqueta="Nro Informe">{datos.nroInforme}</V>
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              Santa Cruz, <V etiqueta="Fecha Informe">{datos.fechaInforme}</V>
            </span>
          </div>
        </header>

        {/* 2. MEMORÁNDUM / ENCABEZADO TÉCNICO */}
        <div className="bg-slate-50 border border-slate-300 p-3 rounded text-xs font-serif mb-4 space-y-1">
          <div>
            <strong>A:</strong> <V etiqueta="Destinatario">{datos.secretarioDestinoNombre}</V> — SECRETARIO GENERAL
            U.A.G.R.M.
          </div>
          <div>
            <strong>DE:</strong> <V etiqueta="Emisor">{datos.jefeArchivoNombre}</V> — JEFE DE SECCIÓN ARCHIVO
            CENTRAL
          </div>
          <div>
            <strong>REF.:</strong> Custodia y cotejo en Libros Matrices de{" "}
            <V etiqueta="Tipo Diploma">{datos.tipoDiplomaReferencia}</V>
          </div>
        </div>

        {/* 3. ANTECEDENTES Y SOLICITUD */}
        <div className="text-[12.5px] font-serif space-y-3 text-justify indent-6">
          <p>
            En atención a la solicitud presentada en fecha{" "}
            <V etiqueta="Fecha Solicitud">{datos.fechaSolicitud}</V>
            {datos.tieneApoderado ? (
              <>
                , mediante apoderado legal según Testimonio Notarial N°{" "}
                <V etiqueta="Testimonio">{datos.nroTestimonio || "S/N"}</V>, conferido por{" "}
                <V etiqueta="Poderdante">{datos.nombrePoderdante}</V> en favor de{" "}
                <V etiqueta="Apoderado">{datos.nombreApoderado}</V> con C.I.{" "}
                <V etiqueta="CI Apoderado">{datos.ciApoderado}</V>
              </>
            ) : (
              <span> por la parte interesada</span>
            )}
            ; informo a su autoridad que, habiéndose procedido a la minuciosa búsqueda y cotejo físico en los
            Libros Matrices que se custodian en esta dependencia universitaria, se verificó el siguiente
            registro fidedigno:
          </p>

          {/* 4. TABLA TÉCNICA DE CUSTODIA (9 COLUMNAS OFICIALES) */}
          <div className="overflow-x-auto my-3 border border-slate-900">
            <table className="w-full border-collapse text-[10px] text-center font-sans">
              <thead>
                <tr className="bg-slate-900 text-white uppercase tracking-wider font-semibold">
                  <th className="p-1 border border-slate-700">N° Diploma</th>
                  <th className="p-1 border border-slate-700">Nombre y Apellidos</th>
                  <th className="p-1 border border-slate-700">C.I.</th>
                  <th className="p-1 border border-slate-700">Diploma de</th>
                  <th className="p-1 border border-slate-700">Fojas</th>
                  <th className="p-1 border border-slate-700">Libro</th>
                  <th className="p-1 border border-slate-700">Fecha Extensión</th>
                  <th className="p-1 border border-slate-700">Rector Época</th>
                  <th className="p-1 border border-slate-700">Pie de Firma</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-300">
                <tr className="hover:bg-slate-50 font-serif">
                  <td className="p-1.5 border border-slate-400 font-mono font-bold">
                    <V etiqueta="Nro Diploma">{fila.nroDiploma}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400 font-bold uppercase">
                    <V etiqueta="Nombre">{fila.nombreApellidos}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400 font-mono">
                    <V etiqueta="CI">{fila.ciTitular}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400">
                    <V etiqueta="Diploma De">{fila.diplomaDe}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400 font-mono">
                    <V etiqueta="Fojas">{fila.fojas}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400 font-mono">
                    <V etiqueta="Libro">{fila.libro}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400">
                    <V etiqueta="Fecha Extensión">{fila.fechaExtension}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400">
                    <V etiqueta="Rector">{fila.nombreRector}</V>
                  </td>
                  <td className="p-1.5 border border-slate-400 font-semibold">
                    <V etiqueta="Pie de Firma">{fila.pieFirmaRector}</V>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. CLÁUSULAS ADICIONALES Y ANTECEDENTES */}
          {datos.aclaratoriaFirmaEpoca && (
            <p>
              <strong>Observación Técnica de Firmas:</strong>{" "}
              <V etiqueta="Aclaratoria">{datos.aclaratoriaFirmaEpoca}</V>
            </p>
          )}

          {datos.antecedenteSupletorio && (
            <p>
              <strong>Antecedente de Supletorio:</strong>{" "}
              <V etiqueta="Antecedente Supletorio">{datos.antecedenteSupletorio}</V>
            </p>
          )}

          {datos.antecedenteRectificacion && (
            <p>
              <strong>Antecedente de Rectificación:</strong>{" "}
              <V etiqueta="Antecedente Rectificación">{datos.antecedenteRectificacion}</V>
            </p>
          )}

          <p>
            Es cuanto tengo a bien informar a su autoridad para los fines consiguientes y trámites de
            certificación legal correspondientes.
          </p>
        </div>
      </div>

      {/* 6. FIRMA DEL JEFE DE SECCIÓN ARCHIVO CENTRAL */}
      <footer className="mt-8 pt-4">
        <div className="flex justify-center items-end">
          <div className="text-center w-72 border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              <V etiqueta="Jefe Archivo">{datos.jefeArchivoNombre}</V>
            </p>
            <p className="text-[11px] font-serif font-semibold uppercase text-slate-700">
              Jefe Sección Archivo Central
            </p>
            <p className="text-[10px] font-serif uppercase tracking-widest text-slate-500">
              Departamento de Títulos y Grados — U.A.G.R.M.
            </p>
          </div>
        </div>

        {/* Franja de Seguridad Inferior */}
        <div className="mt-6 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span>UAGRM — Archivo Central</span>
          <span>Custodia Física Verificada</span>
          <span>Libro Matriz: {fila.libro}</span>
        </div>
      </footer>
    </div>
  );
};
