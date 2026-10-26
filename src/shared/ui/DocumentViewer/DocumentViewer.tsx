// src/shared/ui/DocumentViewer/DocumentViewer.tsx
import * as React from "react";
import { 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  FileText,
  Copy,
  Check
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../Button";
import { Badge } from "../Badge";
import "./DocumentViewer.css";

export type TamanoPapel = "A4" | "LETTER";

export interface DocumentViewerProps {
  children: React.ReactNode;
  titulo?: string;
  subtitulo?: string;
  codigoDocumento?: string;
  estadoBadge?: string;
  varianteBadge?: "neutral" | "success" | "warning" | "danger";
  tamanoInicial?: TamanoPapel;
  zoomInicial?: number;
  mostrarGuiaEncuadernacionPorDefecto?: boolean;
  className?: string;
  toolbarExtra?: React.ReactNode;
  onPrint?: () => void;
}

/**
 * Escudo oficial institucional de la UAGRM vectorizado en alta definición
 */
export const EscudoUagrmSvg: React.FC<{ className?: string; size?: number }> = ({ 
  className, 
  size = 64 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("select-none flex-shrink-0", className)}
    aria-label="Escudo Oficial UAGRM"
  >
    {/* Contorno del Escudo */}
    <path
      d="M50 4C28 4 12 16 12 40C12 76 50 114 50 114C50 114 88 76 88 40C88 16 72 4 50 4Z"
      fill="#002855"
      stroke="#C5A059"
      strokeWidth="2.5"
    />
    {/* Campo superior (Azul UAGRM) */}
    <path
      d="M16 40C16 20 30 10 50 10C70 10 84 20 84 40H16Z"
      fill="#191A7D"
    />
    {/* Campo inferior particionado */}
    <path
      d="M16 40C16 70 50 105 50 105V40H16Z"
      fill="#8B0000"
    />
    <path
      d="M50 40V105C50 105 84 70 84 40H50Z"
      fill="#002855"
    />
    {/* Cruz Potenzada / Estrella Simbólica Dorada */}
    <path
      d="M50 18L53 28L63 31L53 34L50 44L47 34L37 31L47 28L50 18Z"
      fill="#FFD700"
      stroke="#C5A059"
      strokeWidth="0.5"
    />
    {/* Libro Abierto de la Sabiduría (Fondo blanco) */}
    <path
      d="M32 54C38 52 46 54 50 56C54 54 62 52 68 54V76C62 74 54 76 50 78C46 76 38 74 32 76V54Z"
      fill="#FFFFFF"
      stroke="#002855"
      strokeWidth="1.2"
    />
    <line x1="50" y1="56" x2="50" y2="78" stroke="#002855" strokeWidth="1" />
    <line x1="36" y1="59" x2="46" y2="61" stroke="#64748B" strokeWidth="0.8" />
    <line x1="36" y1="65" x2="46" y2="67" stroke="#64748B" strokeWidth="0.8" />
    <line x1="36" y1="71" x2="46" y2="73" stroke="#64748B" strokeWidth="0.8" />
    <line x1="54" y1="61" x2="64" y2="59" stroke="#64748B" strokeWidth="0.8" />
    <line x1="54" y1="67" x2="64" y2="65" stroke="#64748B" strokeWidth="0.8" />
    <line x1="54" y1="73" x2="64" y2="71" stroke="#64748B" strokeWidth="0.8" />
    {/* Laurel / Orla decorativa */}
    <path
      d="M26 86C32 94 42 100 50 104C58 100 68 94 74 86"
      stroke="#FFD700"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />
  </svg>
);

/**
 * Componente DocumentViewer
 * Canvas A4 con control de zoom, guía de encuadernación (4cm), y botón de impresión limpia.
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  children,
  titulo = "Documento Oficial Normalizado",
  subtitulo = "UAGRM — Secretaría General / Títulos y Archivo Central",
  codigoDocumento,
  estadoBadge = "Válido para Trámite",
  varianteBadge = "success",
  tamanoInicial = "A4",
  zoomInicial = 80,
  mostrarGuiaEncuadernacionPorDefecto = false,
  className,
  toolbarExtra,
  onPrint
}) => {
  const [zoom, setZoom] = React.useState<number>(zoomInicial);
  const [tamano, setTamano] = React.useState<TamanoPapel>(tamanoInicial);
  const [mostrarGuia, setMostrarGuia] = React.useState<boolean>(mostrarGuiaEncuadernacionPorDefecto);
  const [copiado, setCopiado] = React.useState<boolean>(false);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);
  const handleZoomFit = () => setZoom(85);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleCopiarTexto = () => {
    if (sheetRef.current) {
      const texto = sheetRef.current.innerText;
      navigator.clipboard.writeText(texto).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-slate-950 text-slate-100", className)}>
      {/* Barra de Control / Toolbar Superior */}
      <header className="uagrm-no-print flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 z-20 shadow-md">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-blue-300">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-slate-100 truncate">{titulo}</h2>
              {codigoDocumento && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {codigoDocumento}
                </span>
              )}
              {estadoBadge && (
                <Badge variant={varianteBadge}>
                  {estadoBadge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
          </div>
        </div>

        {/* Controles de Vista, Zoom e Impresión */}
        <div className="flex items-center space-x-2">
          {toolbarExtra}

          {/* Selector de Tamaño de Papel */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setTamano("A4")}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-colors",
                tamano === "A4" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Formato Estándar A4 (210 x 297 mm)"
            >
              A4
            </button>
            <button
              onClick={() => setTamano("LETTER")}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-colors",
                tamano === "LETTER" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Formato Carta Oficial (215.9 x 279.4 mm)"
            >
              Carta
            </button>
          </div>

          <div className="h-5 w-px bg-slate-700" />

          {/* Toggle Guía de Encuadernación 4cm */}
          <button
            onClick={() => setMostrarGuia((v) => !v)}
            className={cn(
              "p-1.5 rounded-lg border text-xs flex items-center space-x-1.5 transition-colors",
              mostrarGuia
                ? "bg-red-950/60 border-red-700/70 text-red-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            )}
            title="Activar/Desactivar guía de margen de encuadernación (4.0 cm izquierdo)"
          >
            {mostrarGuia ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Margen 4cm</span>
          </button>

          {/* Controles de Zoom */}
          <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
              title="Alejar (-10%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-medium px-1.5 text-slate-200 min-w-[40px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
              title="Acercar (+10%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Restablecer (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomFit}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Ajustar al visor (85%)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-700" />

          {/* Botón Copiar Texto */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopiarTexto}
            className="text-slate-200 border-slate-700 hover:bg-slate-800 text-xs h-8"
            title="Copiar texto formal al portapapeles"
          >
            {copiado ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copiado ? "Copiado" : "Copiar"}
          </Button>

          {/* Botón Imprimir Oficial */}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm text-xs h-8"
            title="Imprimir documento oficial en formato A4/Carta"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Imprimir</span>
          </Button>
        </div>
      </header>

      {/* Espacio de Trabajo / Canvas Central con Scroll */}
      <main className="uagrm-document-workspace flex-1 overflow-auto p-8 flex justify-center items-start">
        <div 
          className="transition-all duration-150 ease-out origin-top my-4"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Hoja de papel física */}
          <div
            ref={sheetRef}
            className={cn(
              tamano === "A4" ? "uagrm-sheet-a4" : "uagrm-sheet-letter",
              mostrarGuia && "uagrm-binding-guide",
              "uagrm-printable-document relative"
            )}
          >
            {/* Marca de agua de seguridad */}
            <div className="uagrm-watermark">
              <EscudoUagrmSvg size={450} className="w-full h-full opacity-100" />
            </div>

            {/* Contenido renderizado del documento */}
            <div className="relative z-10 w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Barra de Estado Inferior */}
      <footer className="uagrm-no-print flex items-center justify-between px-4 py-1.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Formato Estandarizado UAGRM</span>
          </span>
          <span>•</span>
          <span>Margen izquierdo de encuadernación: <strong>4.0 cm</strong></span>
          <span>•</span>
          <span>Márgenes: Sup. 3.5cm, Inf. 2.5cm, Der. 2.0cm</span>
        </div>
        <div className="font-mono text-slate-500">
          Papel: {tamano === "A4" ? "A4 (210 × 297 mm)" : "Carta (215.9 × 279.4 mm)"} | Zoom: {zoom}%
        </div>
      </footer>
    </div>
  );
};
