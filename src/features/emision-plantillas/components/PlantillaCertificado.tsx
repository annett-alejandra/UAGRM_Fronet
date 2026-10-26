// src/views/VistaEmisionPlantillas/components/PlantillaCertificado.tsx
import * as React from "react";
import type { DatosCertificadoAutenticidad } from "@/shared/types/plantillas.types";
import { EscudoUagrmSvg } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

export interface PlantillaCertificadoProps {
  datos: DatosCertificadoAutenticidad;
  resaltarVariables?: boolean;
}

/**
 * Plantilla Oficial Estandarizada: Certificado de Autenticidad UAGRM (Tipos 1 al 5)
 * Respeta fielmente los 13 folios del archivo oficial y la transcripción de Docs/ExtraPdfs.md.
 */
export const PlantillaCertificado: React.FC<PlantillaCertificadoProps> = ({
  datos,
  resaltarVariables = false,
}) => {
  // Renderizador condicional con resaltado amarillo si está habilitado
  const V: React.FC<{ children: React.ReactNode; etiqueta?: string }> = ({ children, etiqueta }) => (
    <span
      title={etiqueta}
      className={cn(
        "font-semibold",
        resaltarVariables && "bg-amber-200/80 px-1 py-0.5 rounded text-amber-950 border border-amber-300"
      )}
    >
      {children}
    </span>
  );

  return (
    <div className="flex flex-col justify-between h-full min-h-[235mm] text-slate-900 leading-relaxed text-justify">
      {/* 1. ENCABEZADO INSTITUCIONAL OFICIAL */}
      <div>
        <header className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <EscudoUagrmSvg size={70} />
            <div>
              <h1 className="text-base font-bold tracking-wider text-slate-950 uppercase font-serif">
                Universidad Autónoma &quot;Gabriel René Moreno&quot;
              </h1>
              <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase">
                Secretaría General
              </p>
              <p className="text-[11px] text-slate-600 uppercase font-mono">
                Santa Cruz — Bolivia
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="border-2 border-slate-900 px-3 py-1.5 rounded-sm inline-block bg-slate-50">
              <span className="text-[11px] font-bold block uppercase text-slate-700">Certificado</span>
              <span className="text-base font-bold font-mono text-slate-900">
                <V etiqueta="Nro de Certificado">{datos.nroCertificado}</V>
              </span>
            </div>
          </div>
        </header>

        {/* 2. TÍTULO Y FÓRMULA DE ENTRADA */}
        <div className="text-center my-6">
          <h2 className="text-sm font-bold tracking-widest uppercase font-serif underline decoration-slate-400 underline-offset-4">
            Certificado de Autenticidad
          </h2>
          <p className="text-xs font-serif mt-2 tracking-wide font-bold uppercase text-slate-800">
            El Secretario General de la Universidad Autónoma &quot;Gabriel René Moreno&quot;
          </p>
          <p className="text-sm font-serif font-black tracking-widest uppercase mt-1 text-slate-950">
            CERTIFICA:
          </p>
        </div>

        {/* 3. PÁRRAFO 1: FÓRMULA INVARIABLE DE CERTIFICACIÓN */}
        <div className="text-[13px] font-serif space-y-4 text-justify indent-8">
          <p>
            Que, de acuerdo al informe evacuado por la Sección Archivo Central de esta Casa de Estudios
            Superiores <V etiqueta="Nro Informe Archivo">{datos.nroInformeArchivo}</V> de fecha{" "}
            <V etiqueta="Fecha Informe Archivo">{datos.fechaInformeArchivo}</V>, se evidencia que el{" "}
            <V etiqueta="Tipo y Denominación del Título">{datos.tipoYNombreTitulo}</V>{" "}
            <V etiqueta="Nro de Título">{datos.nroTitulo}</V>, extendido en favor{" "}
            <V etiqueta="Condición y Nombre del Ciudadano">{datos.condicionCiudadanoYNombre}</V>, con C.I.{" "}
            <V etiqueta="C.I. Titular">{datos.ciTitular}</V>, cursa inscrito en el Libro de Registro de{" "}
            <V etiqueta="Libro de Registro">{datos.tipoYNombreTitulo}</V>{" "}
            <V etiqueta="Nro Libro">{datos.nroLibro}</V>, a Fojas{" "}
            <V etiqueta="Nro Fojas">{datos.nroFojas}</V>, con fecha de emisión{" "}
            <V etiqueta="Fecha Emisión Título">{datos.fechaEmisionTitulo}</V>.
          </p>

          {/* 4. PÁRRAFO 2 CONDICIONAL: Aclaratoria de Firma Histórica (Tipos 2, 3, 4_5_B) */}
          {(datos.subtipo === "TIPO_2" ||
            datos.subtipo === "TIPO_3" ||
            datos.subtipo === "TIPO_4_5_B" ||
            datos.incluirAclaratoriaFirma) &&
            datos.anioGestion && (
              <p>
                Asimismo, se aclara que, en los libros matrices del año{" "}
                <V etiqueta="Año Gestión">{datos.anioGestion}</V>, el pie de firma solo correspondía al
                Secretario General y al Jefe de Títulos y Grados, no así a la Máxima Autoridad
                Universitaria de ese periodo.
              </p>
            )}

          {/* 4. PÁRRAFO 2 VARIANTE A CONDICIONAL: Legitimación Rectoral Res. CEU (Tipo 4_A) */}
          {datos.subtipo === "TIPO_4_A" && datos.nroResolucionCeu && (
            <p>
              Asimismo, se aclara que, para la emisión del presente documento se dio cumplimiento a lo
              establecido en la Resolución C.E.U.{" "}
              <V etiqueta="Nro Resolución C.E.U.">{datos.nroResolucionCeu}</V> de fecha{" "}
              <V etiqueta="Fecha Resolución C.E.U.">{datos.fechaResolucionCeu}</V>, la cual legitima la
              firma de la Máxima Autoridad Ejecutiva de ese entonces{" "}
              <V etiqueta="Rector Gestión Original">{datos.rectorGestionOriginal}</V>, toda vez que en el año
              de emisión del documento <V etiqueta="Año Gestión Original">{datos.anioGestionOriginal}</V>, se
              encontraba en ejercicio legal de sus funciones; en tal sentido, la actual autoridad{" "}
              <V etiqueta="Rector Actual">{datos.rectorActual}</V>, Rector de la Universidad Autónoma Gabriel
              René Moreno (Gestión <V etiqueta="Período Gestión">{datos.periodoGestionActual}</V>), procede a
              la firma y refrendo del presente certificado en estricto apego a la normativa universitaria
              vigente.
            </p>
          )}

          {/* 5. PÁRRAFO 3 CONDICIONAL: Supletorio previo (Tipos 3 y 4_5_B) */}
          {(datos.subtipo === "TIPO_3" || datos.subtipo === "TIPO_4_5_B") &&
            datos.tipoYNroSupletorio && (
              <p>
                De igual manera, se hace constar que a solicitud de{" "}
                <V etiqueta="Género Interesado">{datos.generoInteresado || "la interesada"}</V>, en fecha{" "}
                <V etiqueta="Fecha Literal Supletorio">{datos.fechaLiteralSupletorio}</V>, se extendió el{" "}
                <V etiqueta="Tipo y Nro Supletorio">{datos.tipoYNroSupletorio}</V>, debidamente firmado por
                las autoridades universitarias de ese entonces:{" "}
                <V etiqueta="Secretario Firmante">{datos.secretarioGeneralFirmante}</V> y{" "}
                <V etiqueta="Rector Firmante">{datos.rectorFirmante}</V>.
              </p>
            )}

          {/* 6. PÁRRAFO 4 CONDICIONAL: Rectificación en Reverso (Tipo 4_5_B) */}
          {datos.subtipo === "TIPO_4_5_B" && datos.nombreRectificado && (
            <p>
              Por otra parte, se hace constar que al reverso del mencionado Supletorio cursa la
              Providencia aclaratoria de fecha{" "}
              <V etiqueta="Fecha Aclarativa Reverso">{datos.fechaAclarativaReverso}</V>, mediante la cual se
              rectificó el nombre del titular a{" "}
              <V etiqueta="Nombre Rectificado">{datos.nombreRectificado}</V> y C.I.{" "}
              <V etiqueta="C.I. Rectificado">{datos.ciRectificado}</V>.
            </p>
          )}

          {/* 7. CIERRE LEGAL INVARIABLE */}
          <p>
            Es cuanto certifico, en honor a la verdad y a solicitud verbal de la parte interesada, para
            los fines que a derecho convengan.
          </p>
        </div>
      </div>

      {/* 8. LUGAR, FECHA Y PIE DE FIRMA INSTITUCIONAL */}
      <footer className="mt-8 pt-4">
        <p className="text-[13px] font-serif text-right mb-16">
          Santa Cruz de la Sierra,{" "}
          <V etiqueta="Fecha Emisión Certificado">{datos.fechaEmisionCertificado}</V>
        </p>

        <div className="flex justify-center items-end">
          <div className="text-center w-72 border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              Lic. Edy Acosta Claros
            </p>
            <p className="text-[11px] font-serif font-semibold uppercase text-slate-700">
              Secretario General
            </p>
            <p className="text-[10px] font-serif uppercase tracking-widest text-slate-500">
              Universidad Autónoma &quot;Gabriel René Moreno&quot;
            </p>
          </div>
        </div>

        {/* Franja de Seguridad Inferior */}
        <div className="mt-8 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span>UAGRM — Sistema de Certificaciones Digitales</span>
          <span>Doc. Ref: CERT-{datos.subtipo}-{datos.nroCertificado.replace(/[^a-zA-Z0-9]/g, "")}</span>
          <span>Válido según reglamentación oficial</span>
        </div>
      </footer>
    </div>
  );
};
