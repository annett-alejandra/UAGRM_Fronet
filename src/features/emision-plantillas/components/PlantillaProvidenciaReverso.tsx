// src/views/VistaEmisionPlantillas/components/PlantillaProvidenciaReverso.tsx
import * as React from "react";
import type { DatosProvidenciaReverso } from "@/shared/types/plantillas.types";
import { EscudoUagrmSvg } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

export interface PlantillaProvidenciaReversoProps {
  datos: DatosProvidenciaReverso;
  resaltarVariables?: boolean;
}

/**
 * Plantilla Oficial Estandarizada: Providencia Rectificatoria (Reverso del Supletorio)
 * Variantes SERECI (Supresión/Corrección de Nombre - Pág. 11) y SEGIP (Complementación - Pág. 13)
 */
export const PlantillaProvidenciaReverso: React.FC<PlantillaProvidenciaReversoProps> = ({
  datos,
  resaltarVariables = false,
}) => {
  const V: React.FC<{ children: React.ReactNode; etiqueta?: string }> = ({ children, etiqueta }) => (
    <span
      title={etiqueta}
      className={cn(
        "font-semibold",
        resaltarVariables && "bg-amber-100 px-1 py-0.5 rounded text-amber-950 border border-amber-300"
      )}
    >
      {children}
    </span>
  );

  const esSereci = datos.subtipo === "RECTIFICACION_NOMBRE";

  return (
    <div className="flex flex-col justify-between h-full min-h-[235mm] text-slate-900 leading-relaxed text-justify">
      {/* 1. ENCABEZADO DE ASESORÍA JURÍDICA */}
      <div>
        <header className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <EscudoUagrmSvg size={65} />
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-950 uppercase font-serif">
                Universidad Autónoma &quot;Gabriel René Moreno&quot;
              </h1>
              <p className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                Dirección de Asesoría Jurídica — Secretaría General
              </p>
              <p className="text-[11px] text-slate-600 font-mono uppercase">
                Reverso del Título Supletorio
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono px-2 py-1 bg-slate-100 border border-slate-400 rounded">
              {esSereci ? "Mod. SERECI (Nombre)" : "Mod. SEGIP (C.I.)"}
            </span>
          </div>
        </header>

        {/* 2. TÍTULO */}
        <div className="text-center my-4">
          <h2 className="text-base font-serif font-black tracking-widest uppercase underline underline-offset-4 text-slate-950">
            Providencia Rectificatoria
          </h2>
        </div>

        {/* 3. VISTOS Y CONSIDERANDOS */}
        <div className="text-[13px] font-serif space-y-4 text-justify indent-8">
          <p>
            Santa Cruz de la Sierra,{" "}
            <V etiqueta="Fecha Providencia">{datos.fechaProvidencia}</V>.
          </p>

          <p>
            <strong>VISTOS:</strong> La solicitud de rectificación interpuesta; Certificado de Nacimiento{" "}
            <V etiqueta="Nro Cert. Nacimiento">{datos.nroCertNacimiento}</V> emitido por la Oficialía de
            Registro Civil <V etiqueta="Nro Oficialía">{datos.nroOficialiaSereci}</V>; Informe Técnico de
            Archivo Central N° <V etiqueta="Nro Inf. Archivo">{datos.nroInfArchivo}</V> de fecha{" "}
            <V etiqueta="Fecha Inf. Archivo">{datos.fechaInfArchivo}</V>;{" "}
            {esSereci ? (
              <>
                Resolución Administrativa de Rectificación de Partida de Nacimiento{" "}
                <V etiqueta="Nro Partida SERECI">{datos.nroPartidaSereci || "S/N"}</V>; e Informe Legal de
                Asesoría Jurídica N° <V etiqueta="Nro Inf. Legal">{datos.nroInformeLegal}</V> de fecha{" "}
                <V etiqueta="Fecha Inf. Legal">{datos.fechaInformeLegal}</V>, que aconseja dar curso a{" "}
                <V etiqueta="Motivo">{datos.motivoRectificacion}</V>;
              </>
            ) : (
              <>
                Certificado de Complementación SEGIP de fecha{" "}
                <V etiqueta="Fecha Cert. SEGIP">{datos.fechaCertSegip || "S/F"}</V>; Resolución Administrativa
                SEGIP N° <V etiqueta="Nro Res. SEGIP">{datos.nroResSegip || "S/N"}</V> de fecha{" "}
                <V etiqueta="Fecha Res. SEGIP">{datos.fechaResSegip || "S/F"}</V>; e Informe Legal de Asesoría
                Jurídica N° <V etiqueta="Nro Inf. Legal">{datos.nroInformeLegal}</V> de fecha{" "}
                <V etiqueta="Fecha Inf. Legal">{datos.fechaInformeLegal}</V>;
              </>
            )}
          </p>

          <p>
            <strong>CONSIDERANDO:</strong> Que revisados los antecedentes que cursan en obrados y
            evidenciándose la plena identidad del impetrante respecto al titular del documento académico
            cursante en los Libros Matrices que custodia la Universidad;
          </p>

          <p>
            <strong>POR TANTO:</strong> El Secretario General de la Universidad Autónoma &quot;Gabriel René
            Moreno&quot;, en uso de sus facultades legítimas conferidas por el Estatuto Orgánico:
          </p>

          <p>
            <strong>DISPONE:</strong> Que al presente{" "}
            <V etiqueta="Referencia del Supletorio">{datos.tipoYNroSupletorioReferencia}</V>, se tenga por
            rectificado y complementado el dato de filiación del titular, debiendo entenderse y consignarse a
            partir de la fecha con la siguiente redacción definitiva:
          </p>

          {/* Cuadro de Datos Rectificados */}
          <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-sm my-4 not-italic space-y-1.5 font-mono text-xs">
            <div>
              <span className="text-slate-600 font-sans font-bold">NOMBRE Y APELLIDOS:</span>{" "}
              <V etiqueta="Nombre Rectificado Definitivo">{datos.nombreFinalRectificado}</V>
            </div>
            <div>
              <span className="text-slate-600 font-sans font-bold">CÉDULA DE IDENTIDAD:</span>{" "}
              <V etiqueta="C.I. Definitivo">{datos.ciFinalRectificado}</V>
            </div>
            <div>
              <span className="text-slate-600 font-sans font-bold">LUGAR Y FECHA DE NACIMIENTO:</span>{" "}
              <V etiqueta="Fecha y Lugar">{datos.fechaNacimiento}, {datos.lugarNacimiento}</V>
            </div>
          </div>

          <p>
            Regístrese, archívese y hágase constar en obrados para los fines legales que correspondan.
          </p>
        </div>
      </div>

      {/* 4. FIRMAS OFICIALES: ASESORÍA JURÍDICA Y SECRETARÍA GENERAL */}
      <footer className="mt-12 pt-6">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div className="border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              Director de Asesoría Jurídica
            </p>
            <p className="text-[11px] font-serif uppercase text-slate-700">
              Universidad Autónoma &quot;Gabriel René Moreno&quot;
            </p>
          </div>

          <div className="border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              Lic. Edy Acosta Claros
            </p>
            <p className="text-[11px] font-serif font-semibold uppercase text-slate-700">
              Secretario General — U.A.G.R.M.
            </p>
          </div>
        </div>

        {/* Franja de Seguridad Inferior */}
        <div className="mt-8 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span>UAGRM — Asesoría Jurídica</span>
          <span>Informe Legal: {datos.nroInformeLegal}</span>
          <span>Providencia Inscrita en Matriz</span>
        </div>
      </footer>
    </div>
  );
};
