// src/entities/certificado/ui/CertificadoPreview.tsx
import { getConfiguracionTipo, type DatosCertificado, type TipoCertificadoValue } from "../model";
import { ShieldCheck } from "lucide-react";

type Props = {
  tipo: TipoCertificadoValue;
  datos: Partial<DatosCertificado>;
};

export function CertificadoPreview({ tipo, datos }: Props) {
  const config = getConfiguracionTipo(tipo);
  const d = datos as Record<string, string>;

  const isSupletorioDiploma = tipo === "TIPO_4_SUPLETORIO_DIPLOMA";
  const isSupletorioTitulo = tipo === "TIPO_5_SUPLETORIO_TITULO";
  const isTipo3 = tipo === "TIPO_3_COPIA_OCR";
  const isTipo2 = tipo === "TIPO_2_HISTORICO";

  return (
    <div className="border border-slate-300 rounded-lg p-6 bg-slate-50/50 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Vista Previa en Vivo (PDF A4 Normalizado)</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
          {config.label}
        </span>
      </div>

      {/* Simulated A4 Paper */}
      <div className="bg-white border border-slate-300 shadow-md rounded-sm p-8 font-serif text-slate-800 text-xs leading-relaxed max-w-2xl mx-auto space-y-4 relative">
        
        {/* Photo Box for Supletorio Título */}
        {isSupletorioTitulo && (
          <div className="absolute top-8 right-8 w-24 h-28 border-2 border-dashed border-slate-300 rounded bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-[9px] text-center p-1">
            <span className="font-bold">FOTO 4x4</span>
            <span>Fondo Rojo / Sello</span>
          </div>
        )}

        {/* Encabezado */}
        <div className="text-center space-y-1 pb-3 border-b border-slate-200">
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-amber-400 font-bold text-base shadow-sm">
              U
            </div>
          </div>
          <h2 className="font-bold text-xs tracking-wide uppercase text-blue-950">
            UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
          </h2>
          <h3 className="font-semibold text-[10px] uppercase tracking-wider text-slate-600">
            SANTA CRUZ - BOLIVIA
          </h3>
          <p className="font-sans text-[9px] text-slate-500 font-bold tracking-widest pt-0.5">
            SECRETARÍA GENERAL — SECCIÓN ARCHIVO CENTRAL
          </p>
        </div>

        {/* Título de Encabezado por Tipo */}
        <div className="text-center py-2">
          {isSupletorioDiploma && (
            <h4 className="font-bold text-xs uppercase underline decoration-emerald-600 underline-offset-4 text-slate-900">
              SUPLETORIO DE DIPLOMA DE BACHILLER N° {d.nroCertificado || "____"}
            </h4>
          )}
          {isSupletorioTitulo && (
            <h4 className="font-bold text-xs uppercase underline decoration-red-600 underline-offset-4 text-slate-900 pr-28">
              SUPLETORIO DEL TÍTULO EN PROVISIÓN NACIONAL N° {d.nroCertificado || "____"}
            </h4>
          )}
          {!isSupletorioDiploma && !isSupletorioTitulo && (
            <>
              <h4 className="font-bold text-sm uppercase underline decoration-amber-500 underline-offset-4 text-slate-900">
                CERTIFICADO N° {d.nroCertificado || "749/2026"}
              </h4>
              {d.nroInforme && (
                <p className="text-[10px] font-sans font-mono text-slate-500 mt-1">
                  REF: {d.nroInforme}
                </p>
              )}
            </>
          )}
        </div>

        {/* Autoridades */}
        <div className="text-justify space-y-3 font-serif text-[11px]">
          {isTipo3 ? (
            <p>
              <strong>LOS SUSCRITOS RECTOR DR. REINERIO VARGAS BANEGAS Y SECRETARIO GENERAL MSC. EDY ACOSTA CLAROS, EN SU CALIDAD DE AUTORIDADES DE LA UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO":</strong>
            </p>
          ) : !isSupletorioDiploma && !isSupletorioTitulo ? (
            <p>
              <strong>LA UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO POR MEDIO DE SUS AUTORIDADES EL RECTOR DR. REINERIO VARGAS BANEGAS Y EL SECRETARIO GENERAL MSC. EDY ACOSTA CLAROS:</strong>
            </p>
          ) : null}

          {config.mostrarCertifican && (
            <p className="font-bold text-center tracking-widest text-xs my-2 text-blue-900">
              CERTIFICAN:
            </p>
          )}

          {/* Cuerpo Legal */}
          <p>
            Que, en atención al informe SECCION ARCHIVO/INF N° <strong>{d.nroInforme || "472"}</strong> de fecha <strong>{d.fechaInforme || "2026-04-20"}</strong>, tenemos a bien certificar los antecedentes oficiales del interesado registrado en los libros matrices del Archivo Central:
          </p>

          {/* Caja de Datos */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5 font-sans text-[11px] my-3">
            {d.nombreTitular && (
              <div>
                <span className="font-semibold text-slate-600">Titular: </span>
                <span className="font-bold text-slate-900 uppercase">{d.nombreTitular}</span>
              </div>
            )}
            {d.ciTitular && (
              <div>
                <span className="font-semibold text-slate-600">C.I.: </span>
                <span className="font-mono">{d.ciTitular}</span>
              </div>
            )}
            {d.lugarNacimiento && (
              <div>
                <span className="font-semibold text-slate-600">Natural de: </span>
                <span>{d.lugarNacimiento}</span>
              </div>
            )}
            
            {/* Título Centrado en Mayúsculas (Ajuste Supletorio Título) */}
            {d.tituloProfesional && (
              <div className="my-2 text-center">
                <span className="text-[10px] text-slate-500 block">Título Otorgado:</span>
                <span className="font-bold text-blue-950 uppercase tracking-wide text-xs block pt-0.5">
                  {d.tituloProfesional}
                </span>
              </div>
            )}

            {d.tituloDiploma && (
              <div>
                <span className="font-semibold text-slate-600">Diploma: </span>
                <span className="font-semibold text-blue-950">{d.tituloDiploma}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-1 text-[10px] font-mono text-slate-600 border-t border-slate-200 mt-2">
              {d.libro && <span>Libro N°: <strong>{d.libro}</strong></span>}
              {d.fojas && <span>Fojas N°: <strong>{d.fojas}</strong></span>}
              {d.nroDiploma && <span>N° Diploma: <strong>{d.nroDiploma}</strong></span>}
              {d.nroTitulo && <span>N° Título: <strong>{d.nroTitulo}</strong></span>}
              {d.fechaEmisionTitulo && <span>Fecha Emisión: <strong>{d.fechaEmisionTitulo}</strong></span>}
            </div>
          </div>

          {/* Aclaratoria Tipo 2 */}
          {isTipo2 && (
            <p className="italic text-slate-700 bg-amber-50/50 p-2.5 rounded border border-amber-200/60 text-[10.5px]">
              <strong>Aclaratoria:</strong> Aclarando que en la gestión {d.gestionEpoca || "1999"} no se estilaba colocar pie de firma de las autoridades en el documento original.
            </p>
          )}

          {/* Aclaratoria Tipo 3 (Resolución CEU) */}
          {isTipo3 && (
            <p className="text-[10px] text-slate-700 bg-blue-50/50 p-2.5 rounded border border-blue-200/60 leading-relaxed">
              <strong>Contexto Legal & Resoluciones:</strong> Al mismo tiempo, aclaramos que en la Gestión {d.gestionEpoca || "1999"}, el {d.rectorEpocaNombre || "Dr. Jorge Orellana Moreno"} fungía como Rector de la U.A.G.R.M. y en la actual gestión {d.gestionActual || "2026"}, el Dr. Reinerio Vargas Banegas ha sido electo como máxima autoridad para el periodo {d.periodoGestion || "2025-2029"}, como lo legitima la Resolución C.E.U. N° {d.nroResolucionCEU || "012/2025"} de fecha {d.fechaResolucion || "10 de octubre de 2025"} emitida por la Corte Electoral Universitaria.
            </p>
          )}

          {/* Cierre */}
          {isTipo3 ? (
            <p className="pt-2">
              Es cuanto certificamos, a solicitud de la interesada y de conformidad a las normas institucionales vigentes.
            </p>
          ) : isSupletorioDiploma ? (
            <p className="pt-2">
              Por tanto, queda habilitado(a) para continuar estudios superiores de grado universitario.
            </p>
          ) : isSupletorioTitulo ? (
            <p className="pt-2">
              Por tanto, queda habilitado(a) para el ejercicio legal de la profesión en todo el territorio nacional.
            </p>
          ) : (
            <p className="pt-2">
              Es cuanto certificamos sobre la autenticidad y validez del mencionado documento.
            </p>
          )}

          <p className="text-right text-[10px] italic font-sans text-slate-500 pt-2">
            Santa Cruz de la Sierra, {new Date().toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Firmas */}
        {isTipo3 ? (
          <div className="pt-8 grid grid-cols-3 gap-4 text-center font-sans text-[9.5px]">
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">MSc. Edy Acosta Claros</p>
              <p className="text-slate-500">SECRETARIO GENERAL</p>
              <p className="text-slate-400 text-[8.5px]">U.A.G.R.M.</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Dr. Reinerio Vargas Banegas</p>
              <p className="text-slate-500">RECTOR U.A.G.R.M.</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Abg. Itamar Franco</p>
              <p className="text-slate-500">PROFESIONAL STRIA. GRAL.</p>
              <p className="text-slate-400 text-[8.5px]">U.A.G.R.M.</p>
            </div>
          </div>
        ) : isSupletorioDiploma || isSupletorioTitulo ? (
          <div className="pt-10 flex justify-center text-center font-sans text-[10px]">
            <div className="border-t border-slate-400 pt-2 space-y-0.5 w-64">
              <p className="font-bold text-slate-900">Dr. Reinerio Vargas Banegas</p>
              <p className="text-slate-500">RECTOR - U.A.G.R.M.</p>
            </div>
          </div>
        ) : (
          <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans text-[10px]">
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">MSc. Edy Acosta Claros</p>
              <p className="text-slate-500">SECRETARIO GENERAL U.A.G.R.M.</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Dr. Reinerio Vargas Banegas</p>
              <p className="text-slate-500">RECTOR U.A.G.R.M.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
