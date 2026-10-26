// src/views/VistaEmisionPlantillas/components/PlantillaSupletorioAnverso.tsx
import * as React from "react";
import type { DatosSupletorioAnverso } from "@/shared/types/plantillas.types";
import { EscudoUagrmSvg } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

export interface PlantillaSupletorioAnversoProps {
  datos: DatosSupletorioAnverso;
  resaltarVariables?: boolean;
}

/**
 * Plantilla Oficial Estandarizada: Título Supletorio (Anverso)
 * Modelos Bachiller (Art. 186 CPE - Pág. 10) y Título Provisión Nacional (Art. 92 CPE - Pág. 12)
 */
export const PlantillaSupletorioAnverso: React.FC<PlantillaSupletorioAnversoProps> = ({
  datos,
  resaltarVariables = false,
}) => {
  const V: React.FC<{ children: React.ReactNode; etiqueta?: string }> = ({ children, etiqueta }) => (
    <span
      title={etiqueta}
      className={cn(
        "font-semibold",
        resaltarVariables && "bg-indigo-100 px-1 py-0.5 rounded text-indigo-950 border border-indigo-300"
      )}
    >
      {children}
    </span>
  );

  const esBachiller = datos.subtipo === "BACHILLER";

  return (
    <div className="flex flex-col justify-between h-full min-h-[235mm] text-slate-900 leading-relaxed text-justify">
      {/* 1. ENCABEZADO REPUBLICANO E INSTITUCIONAL */}
      <div>
        <header className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex justify-center mb-3">
            <EscudoUagrmSvg size={80} />
          </div>
          <h1 className="text-xs font-serif font-black tracking-widest text-slate-800 uppercase">
            República de Bolivia
          </h1>
          <p className="text-sm font-serif font-bold tracking-widest text-slate-950 uppercase mt-0.5">
            A Nombre de la Nación
          </p>
          <div className="my-2 border-t border-b border-slate-300 py-1 inline-block">
            <p className="text-sm font-serif font-black tracking-wider text-slate-950 uppercase">
              El Rector de la Universidad Autónoma &quot;Gabriel René Moreno&quot;
            </p>
          </div>
          <div className="mt-2">
            <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 border border-slate-800 rounded">
              <V etiqueta="Subtítulo y Nro Documento">
                {datos.subtituloSupletorio} {datos.nroDocumento}
              </V>
            </span>
          </div>
        </header>

        {/* 2. CONSIDERANDOS Y FÓRMULA LEGAL */}
        <div className="text-[13px] font-serif space-y-4 text-justify indent-8">
          <p>
            Por cuanto en los Libros de Registro de Títulos y Grados que se custodian en el Archivo
            Central de esta Universidad, se evidencia que:{" "}
            <V etiqueta="Nombre Completo del Titular">{datos.nombreTitular}</V>, natural de{" "}
            <V etiqueta="Lugar de Nacimiento">{datos.lugarNacimiento}</V>, con Cédula de Identidad N°{" "}
            <V etiqueta="C.I. Titular">{datos.ciTitular}</V>, ha cumplido con todos los requisitos
            establecidos por los Reglamentos y el Estatuto Orgánico de la Universidad Boliviana;
          </p>

          {/* Ramificación según mandato Constitucional */}
          {esBachiller ? (
            <p>
              Por tanto, de conformidad a las atribuciones que le confiere el{" "}
              <strong>Art. 186 de la Constitución Política del Estado</strong>, y habiéndose autorizado la
              emisión del Diploma original en fecha{" "}
              <V etiqueta="Fecha Autorización Original">{datos.fechaAutorizacionOriginal}</V>, inscrito en el
              Libro <V etiqueta="Nro Libro">{datos.nroLibro}</V>, a Fojas{" "}
              <V etiqueta="Nro Fojas">{datos.nroFojas}</V>:
            </p>
          ) : (
            <p>
              Por tanto, en virtud a la facultad conferida por el{" "}
              <strong>Art. 92 de la Constitución Política del Estado</strong>, y habiéndose extendido el
              Título original en fecha{" "}
              <V etiqueta="Fecha Autorización Original">{datos.fechaAutorizacionOriginal}</V>, registrado en
              el Libro <V etiqueta="Nro Libro">{datos.nroLibro}</V>, Fojas{" "}
              <V etiqueta="Nro Fojas">{datos.nroFojas}</V>:
            </p>
          )}

          {/* 3. CLÁUSULA RESOLUTIVA CENTRAL */}
          <div className="text-center py-4 my-2 border-y border-dashed border-slate-400 not-italic">
            <p className="text-xs font-serif font-black tracking-widest uppercase text-slate-800 mb-1">
              {esBachiller ? "CONFIERE EL PRESENTE SUPLETORIO DE:" : "EXPIDE EL PRESENTE SUPLETORIO DEL:"}
            </p>
            <h2 className="text-lg font-serif font-black tracking-wider text-slate-950 uppercase">
              <V etiqueta="Grado / Diploma / Profesión">{datos.gradoDiplomaOProfesion}</V>
            </h2>
            {!esBachiller && (
              <p className="text-xs font-serif italic text-slate-700 mt-2 max-w-lg mx-auto">
                Para que se le reconozca y ejerza libremente la profesión en todo el territorio del Estado
                con todas las prerrogativas y derechos de ley.
              </p>
            )}
          </div>

          {/* 4. DATA LITERAL */}
          <p>
            Dado en el Salón de Actos del Rectorado de la Universidad Autónoma &quot;Gabriel René Moreno&quot;, a
            los <V etiqueta="Día Literal">{datos.diaLiteral}</V> días del mes de{" "}
            <V etiqueta="Mes Literal">{datos.mesLiteral}</V> del año{" "}
            <V etiqueta="Año Literal">{datos.anioLiteral}</V>.
          </p>
        </div>
      </div>

      {/* 5. FIRMAS DE MÁXIMAS AUTORIDADES (RECTOR Y SECRETARIO GENERAL) */}
      <footer className="mt-12 pt-6">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div className="border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              <V etiqueta="Nombre Rector">{datos.rectorNombre}</V>
            </p>
            <p className="text-[11px] font-serif font-semibold uppercase text-slate-700">
              Rector
            </p>
            <p className="text-[10px] font-serif uppercase tracking-widest text-slate-500">
              U.A.G.R.M.
            </p>
          </div>

          <div className="border-t border-slate-900 pt-2">
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-slate-950">
              <V etiqueta="Nombre Secretario General">{datos.secretarioNombre}</V>
            </p>
            <p className="text-[11px] font-serif font-semibold uppercase text-slate-700">
              Secretario General
            </p>
            <p className="text-[10px] font-serif uppercase tracking-widest text-slate-500">
              U.A.G.R.M.
            </p>
          </div>
        </div>

        {/* Franja de Seguridad Inferior */}
        <div className="mt-10 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span>UAGRM — Supletorios Oficiales</span>
          <span>Reg. Matriz: L-{datos.nroLibro} / F-{datos.nroFojas}</span>
          <span>Anverso Oficial</span>
        </div>
      </footer>
    </div>
  );
};
