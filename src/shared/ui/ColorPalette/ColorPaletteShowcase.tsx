import React, { useState } from 'react';
import { UAGRM_COLORS } from '../tokens/colors';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { Check, Copy } from 'lucide-react';

export function ColorPaletteShowcase() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 p-6 sm:p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm">
      {/* Encabezado Ficha Técnica */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAEFFE] text-[#191A7D] text-xs font-bold tracking-wide uppercase mb-3">
          Caja de Herramientas &bull; Design System UAGRM
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191A2D] tracking-tight">
          2. TONOS Y VARIACIONES
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Guía cromática oficial del sistema de títulos supletorios: primarios, secundarios, escala de grises y matriz de combinaciones accesibles.
        </p>
      </div>

      {/* Grid de las 3 Columnas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* A. Variaciones de Azul */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#191A7D]"></span>
            <h3 className="font-bold text-[#191A2D] text-base">A. Variaciones de Azul</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* UAGRM Blue */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.blue.base)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#191A7D] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.blue.base ? '¡Copiado!' : UAGRM_COLORS.blue.base}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">UAGRM Blue</div>
                <div className="text-[10px] text-[#6B7280] font-mono">C:100 M:95 K:5</div>
              </div>
            </div>

            {/* Medio */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.blue.medio)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#2B6CB0] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.blue.medio ? '¡Copiado!' : UAGRM_COLORS.blue.medio}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Medio</div>
                <div className="text-[10px] text-[#6B7280] font-mono">C:85 M:50 K:0</div>
              </div>
            </div>

            {/* Suave */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.blue.suave)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#556DEF] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.blue.suave ? '¡Copiado!' : UAGRM_COLORS.blue.suave}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Suave</div>
                <div className="text-[10px] text-[#6B7280] font-mono">#556DEF / #85BDEF</div>
              </div>
            </div>

            {/* Muy Suave */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.blue.muySuave)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#DAEFFE] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-[#191A7D] bg-white/70 px-1.5 py-0.5 rounded font-bold">
                  {copiedValue === UAGRM_COLORS.blue.muySuave ? '¡Copiado!' : UAGRM_COLORS.blue.muySuave}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Muy Suave</div>
                <div className="text-[10px] text-[#6B7280] font-mono">C:10 M:7 K:1</div>
              </div>
            </div>
          </div>
        </div>

        {/* B. Variaciones de Rojo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D31338]"></span>
            <h3 className="font-bold text-[#191A2D] text-base">B. Variaciones de Rojo</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Rojo */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.red.base)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#D31338] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.red.base ? '¡Copiado!' : UAGRM_COLORS.red.base}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Rojo</div>
                <div className="text-[10px] text-[#6B7280] font-mono">#D31338</div>
              </div>
            </div>

            {/* Melocotón */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.red.melocoton)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#F08C6E] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.red.melocoton ? '¡Copiado!' : UAGRM_COLORS.red.melocoton}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Melocotón</div>
                <div className="text-[10px] text-[#6B7280] font-mono">#F08C6E</div>
              </div>
            </div>

            {/* Salmón (PaleRED) */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.red.salmon)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#F39E8E] flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
                  {copiedValue === UAGRM_COLORS.red.salmon ? '¡Copiado!' : UAGRM_COLORS.red.salmon}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Salmón</div>
                <div className="text-[10px] text-[#6B7280] font-mono">PaleRED</div>
              </div>
            </div>

            {/* Rosado */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.red.rosado)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-20 bg-[#FCECEF] flex items-end p-2.5 border-b border-[#F39E8E]/30">
                <span className="text-[10px] font-mono text-[#D31338] bg-white/70 px-1.5 py-0.5 rounded font-bold">
                  {copiedValue === UAGRM_COLORS.red.rosado ? '¡Copiado!' : UAGRM_COLORS.red.rosado}
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-[#191A2D]">Rosado</div>
                <div className="text-[10px] text-[#6B7280] font-mono">#FCECEF / #EFFAFE</div>
              </div>
            </div>
          </div>
        </div>

        {/* C. Escala de Grises */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></span>
            <h3 className="font-bold text-[#191A2D] text-base">C. Escala de Grises</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Un gris profundo */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.gray.profundo)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-14 bg-[#191A2D] flex items-end p-2">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1 py-0.5 rounded">
                  #191A2D
                </span>
              </div>
              <div className="p-2 bg-white">
                <div className="text-[11px] font-bold text-[#191A2D]">Un-gris-profundo</div>
              </div>
            </div>

            {/* Gris */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.gray.base)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-14 bg-[#6B7280] flex items-end p-2">
                <span className="text-[10px] font-mono text-white/90 bg-black/30 px-1 py-0.5 rounded">
                  #6B7280
                </span>
              </div>
              <div className="p-2 bg-white">
                <div className="text-[11px] font-bold text-[#191A2D]">Gris</div>
              </div>
            </div>

            {/* Gris suave */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.gray.suave)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-14 bg-[#E2E8F0] flex items-end p-2">
                <span className="text-[10px] font-mono text-[#191A2D] bg-white/70 px-1 py-0.5 rounded">
                  #E2E8F0
                </span>
              </div>
              <div className="p-2 bg-white">
                <div className="text-[11px] font-bold text-[#191A2D]">Gris-suave</div>
              </div>
            </div>

            {/* Blanco hueso */}
            <div 
              onClick={() => copyToClipboard(UAGRM_COLORS.gray.blancoHueso)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all hover:shadow-md"
            >
              <div className="h-14 bg-[#F9F9F6] flex items-end p-2 border-b border-[#E2E8F0]">
                <span className="text-[10px] font-mono text-[#191A2D] bg-white/70 px-1 py-0.5 rounded">
                  #F9F9F6
                </span>
              </div>
              <div className="p-2 bg-white">
                <div className="text-[11px] font-bold text-[#191A2D]">Blanco-hueso</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Combinaciones Accesibles y Componentes en Acción */}
      <div className="space-y-6 pt-6 border-t border-[#E2E8F0]">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-[#191A2D]">
              Matriz de Combinaciones Institucionales
            </h3>
            <p className="text-xs text-[#6B7280]">
              Contrastes certificados para interfaces de alta legibilidad en el sistema central.
            </p>
          </div>
          <span className="text-xs bg-[#DAEFFE] text-[#191A7D] font-bold px-3 py-1 rounded-full border border-[#85BDEF]/50">
            WCAG AAA / AA Conforme
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Primaria Sólida */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#191A7D]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191A7D]">1. Primaria Sólida</span>
              <Badge status="primary">UAGRM Blue</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Botones de guardado, radicación oficial y barras principales de navegación.
            </p>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                Guardar Trámite
              </Button>
              <Button variant="outline-blue" size="sm">
                Ver Detalles
              </Button>
            </div>
          </Card>

          {/* 2. Primaria Suave */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#2B6CB0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B6CB0]">2. Primaria Suave</span>
              <Badge status="blue">Activo / Triaje</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Chips de estado aprobado, expedientes en curso y filtros seleccionados.
            </p>
            <div className="flex gap-2">
              <Button variant="soft-blue" size="sm">
                Descargar Acreditación
              </Button>
            </div>
          </Card>

          {/* 3. Secundaria Sólida */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#D31338]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D31338]">3. Secundaria Sólida</span>
              <Badge status="danger">Acción Crítica</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Acciones con efectos jurídicos, declaración jurada y firmas digitales.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Firmar Digitalmente
              </Button>
              <Button variant="outline-red" size="sm">
                Rechazar
              </Button>
            </div>
          </Card>

          {/* 4. Secundaria Suave */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#F39E8E]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D31338]">4. Secundaria Suave</span>
              <Badge status="secondary">Observado</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Alertas de inconsistencias en OCR, folios faltantes y correcciones.
            </p>
            <div className="flex gap-2">
              <Button variant="soft-red" size="sm">
                Ver 2 Observaciones
              </Button>
            </div>
          </Card>

          {/* 5. Melocotón Cálido */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#F08C6E]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B9381E]">5. Melocotón Cálido</span>
              <Badge status="melocoton">En Convalidación</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Trámites intermedios bajo revisión de comisiones o convenios externos.
            </p>
            <div className="p-2.5 rounded-xl bg-[#FFF5F2] border border-[#F08C6E]/40 text-[#B9381E] text-xs font-medium">
              Convenio pendiente de validación en Secretaría
            </div>
          </Card>

          {/* 6. Superficie y Contraste */}
          <Card className="p-5 space-y-3 border-l-4 border-l-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191A2D]">6. Superficie Limpia</span>
              <Badge status="neutral">Estructura</Badge>
            </div>
            <p className="text-xs text-[#6B7280]">
              Contenedores blancos (#FFFFFF) sobre fondo institucional Blanco Hueso (#F9F9F6).
            </p>
            <div className="p-2.5 rounded-xl bg-[#F9F9F6] border border-[#E2E8F0] text-[#191A2D] text-xs font-medium">
              Texto principal de alto contraste (#191A2D)
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default ColorPaletteShowcase;
