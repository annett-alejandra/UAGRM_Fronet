// src/shared/ui/TemplateSelector/TemplateSelector.tsx
import * as React from "react";
import { 
  FileCheck2, 
  Award, 
  Archive, 
  Sparkles,
  BookOpen,
  Scale
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../Badge";
import type { 
  CategoriaDocumento, 
  SubtipoCertificado, 
  SubtipoSupletorio, 
  SubtipoProvidencia 
} from "../../types/plantillas.types";

export type ModoDocumento = 
  | { categoria: 'CERTIFICADOS'; subtipo: SubtipoCertificado }
  | { categoria: 'SUPLETORIOS'; seccion: 'ANVERSO'; subtipo: SubtipoSupletorio }
  | { categoria: 'SUPLETORIOS'; seccion: 'REVERSO'; subtipo: SubtipoProvidencia }
  | { categoria: 'INFORMES'; subtipo: 'INFORME_CUSTODIA' };

export interface TemplateSelectorProps {
  modoSeleccionado: ModoDocumento;
  onSelectModo: (modo: ModoDocumento) => void;
  onCargarCasoReal?: (idCaso: string) => void;
  className?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  modoSeleccionado,
  onSelectModo,
  onCargarCasoReal,
  className
}) => {
  const categoriaActiva: CategoriaDocumento = modoSeleccionado.categoria;

  return (
    <div className={cn("flex flex-col space-y-3 bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm", className)}>
      {/* Selector de Categoría Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_1' })}
          className={cn(
            "flex items-center space-x-3 p-2.5 rounded-lg border text-left transition-all",
            categoriaActiva === 'CERTIFICADOS'
              ? "bg-blue-950/70 border-blue-600 text-blue-100 shadow-sm"
              : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-md",
            categoriaActiva === 'CERTIFICADOS' ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"
          )}>
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Certificados de Autenticidad</div>
            <div className="text-[11px] text-slate-400">Secretaría General (Tipos 1 al 5)</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectModo({ categoria: 'SUPLETORIOS', seccion: 'ANVERSO', subtipo: 'BACHILLER' })}
          className={cn(
            "flex items-center space-x-3 p-2.5 rounded-lg border text-left transition-all",
            categoriaActiva === 'SUPLETORIOS'
              ? "bg-indigo-950/70 border-indigo-600 text-indigo-100 shadow-sm"
              : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-md",
            categoriaActiva === 'SUPLETORIOS' ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"
          )}>
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Títulos Supletorios & Reverso</div>
            <div className="text-[11px] text-slate-400">Anverso CPE y Providencias Legal</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectModo({ categoria: 'INFORMES', subtipo: 'INFORME_CUSTODIA' })}
          className={cn(
            "flex items-center space-x-3 p-2.5 rounded-lg border text-left transition-all",
            categoriaActiva === 'INFORMES'
              ? "bg-emerald-950/70 border-emerald-600 text-emerald-100 shadow-sm"
              : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-md",
            categoriaActiva === 'INFORMES' ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
          )}>
            <Archive className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Informes Archivo Central</div>
            <div className="text-[11px] text-slate-400">Custodia 9 Col. & Libros Matrices</div>
          </div>
        </button>
      </div>

      {/* Subtipos según la categoría activa */}
      <div className="pt-1">
        {categoriaActiva === 'CERTIFICADOS' && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Subtipo:</span>
            
            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_1' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium",
                modoSeleccionado.categoria === 'CERTIFICADOS' && modoSeleccionado.subtipo === 'TIPO_1'
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              Tipo 1: Directo (Pág. 4)
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_2' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium",
                modoSeleccionado.categoria === 'CERTIFICADOS' && modoSeleccionado.subtipo === 'TIPO_2'
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              Tipo 2: Histórico ≤ 1999 (Pág. 5)
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_3' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium",
                modoSeleccionado.categoria === 'CERTIFICADOS' && modoSeleccionado.subtipo === 'TIPO_3'
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              Tipo 3: Con Supletorio (Pág. 2)
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_4_A' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium",
                modoSeleccionado.categoria === 'CERTIFICADOS' && modoSeleccionado.subtipo === 'TIPO_4_A'
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              Tipo 4A: Legitimación Rector (Pág. 6)
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'CERTIFICADOS', subtipo: 'TIPO_4_5_B' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium",
                modoSeleccionado.categoria === 'CERTIFICADOS' && modoSeleccionado.subtipo === 'TIPO_4_5_B'
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              Tipo 4/5B: Con Supletorio & Rect. (Pág. 8)
            </button>
          </div>
        )}

        {categoriaActiva === 'SUPLETORIOS' && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Sección & Variante:</span>
            
            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'SUPLETORIOS', seccion: 'ANVERSO', subtipo: 'BACHILLER' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium flex items-center space-x-1.5",
                modoSeleccionado.categoria === 'SUPLETORIOS' && modoSeleccionado.seccion === 'ANVERSO' && modoSeleccionado.subtipo === 'BACHILLER'
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              <BookOpen className="w-3 h-3" />
              <span>Anverso: Bachiller (Art. 186 CPE - Pág. 10)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'SUPLETORIOS', seccion: 'ANVERSO', subtipo: 'PROVISION_NACIONAL' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium flex items-center space-x-1.5",
                modoSeleccionado.categoria === 'SUPLETORIOS' && modoSeleccionado.seccion === 'ANVERSO' && modoSeleccionado.subtipo === 'PROVISION_NACIONAL'
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              <Award className="w-3 h-3" />
              <span>Anverso: Título Provisión Nacional (Art. 92 CPE - Pág. 12)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'SUPLETORIOS', seccion: 'REVERSO', subtipo: 'RECTIFICACION_NOMBRE' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium flex items-center space-x-1.5",
                modoSeleccionado.categoria === 'SUPLETORIOS' && modoSeleccionado.seccion === 'REVERSO' && modoSeleccionado.subtipo === 'RECTIFICACION_NOMBRE'
                  ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              <Scale className="w-3 h-3" />
              <span>Reverso: Rectificación Nombre SERECI (Pág. 11)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectModo({ categoria: 'SUPLETORIOS', seccion: 'REVERSO', subtipo: 'COMPLEMENTACION_SEGIP' })}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all font-medium flex items-center space-x-1.5",
                modoSeleccionado.categoria === 'SUPLETORIOS' && modoSeleccionado.seccion === 'REVERSO' && modoSeleccionado.subtipo === 'COMPLEMENTACION_SEGIP'
                  ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              <Scale className="w-3 h-3" />
              <span>Reverso: Complementación CI SEGIP ej. '1G' (Pág. 13)</span>
            </button>
          </div>
        )}

        {categoriaActiva === 'INFORMES' && (
          <div className="flex items-center space-x-2">
            <Badge variant="success">
              Plantilla Estandarizada Única: Tabla de Custodia 9 Columnas (Págs. 1, 3, 7, 9)
            </Badge>
            <span className="text-xs text-slate-400">
              Cotejo físico con Libros Matrices de Archivo Central
            </span>
          </div>
        )}
      </div>

      {/* Casos Reales de Prueba (Presets Rápidos basados en los 13 folios) */}
      {onCargarCasoReal && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">Cargar caso real de los folios:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onCargarCasoReal("caso-1-tipo-1")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              title="Gualberto Medina Vargas - TPN Médico Cirujano (Pág. 4)"
            >
              1. Gualberto Medina (T1)
            </button>

            <button
              type="button"
              onClick={() => onCargarCasoReal("caso-2-tipo-2")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              title="Lynne Denisse Perez Revilla - Bachiller 1999 (Pág. 5)"
            >
              2. Lynne Perez (T2)
            </button>

            <button
              type="button"
              onClick={() => onCargarCasoReal("caso-3-tipo-3")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              title="Jenny Flores Peña - Bachiller con Supletorio (Pág. 2)"
            >
              3. Jenny Flores (T3)
            </button>

            <button
              type="button"
              onClick={() => onCargarCasoReal("caso-4-tipo-4a")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              title="Manfredo Villavicencio - Con Legitimación Rectoral Res. CEU (Pág. 6)"
            >
              4. Manfredo V. (T4A)
            </button>

            <button
              type="button"
              onClick={() => onCargarCasoReal("caso-5-tipo-45b")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              title="Roque Tito Bell - Con Supletorio y Rectificación SERECI (Pág. 8)"
            >
              5. Roque Tito Bell (T4/5B)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
