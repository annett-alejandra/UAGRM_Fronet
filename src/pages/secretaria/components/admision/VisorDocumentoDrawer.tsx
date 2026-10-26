import React, { useState, useRef, useEffect } from "react";
import { Button, Badge } from "@shared/ui";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  FileText,
  Stamp,
  Move,
} from "lucide-react";
import { BarraDecision } from "./BarraDecision";
import type { SolicitudAdmision } from "../../types/secretaria.types";

interface VisorDocumentoDrawerProps {
  solicitud: SolicitudAdmision | null;
  onClose: () => void;
  onAprobar: (id: string) => void;
  onRechazar: (id: string, motivo: string) => boolean;
}

export function VisorDocumentoDrawer({
  solicitud,
  onClose,
  onAprobar,
  onRechazar,
}: VisorDocumentoDrawerProps) {
  const [rotacion, setRotacion] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [modoPan, setModoPan] = useState(false);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.style.transform = `translate(${posicion.x}px, ${posicion.y}px) rotate(${rotacion}deg) scale(${zoom})`;
      paperRef.current.style.transformOrigin = "center center";
      paperRef.current.style.transition = isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }, [posicion, rotacion, zoom, isDragging]);

  if (!solicitud) return null;

  const handleRotar = () => {
    setRotacion((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setRotacion(0);
    setPosicion({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modoPan) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - posicion.x,
      y: e.clientY - posicion.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !modoPan) return;
    setPosicion({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const doc = solicitud.documentoAdjunto;

  return (
    <div className="sec-drawer-overlay" onClick={onClose}>
      {/* Drawer al 60% de ancho de la pantalla */}
      <div
        className="sec-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del Drawer */}
        <div className="sec-drawer-header">
          <div>
            <div className="sec-toolbar-group">
              <FileText size={20} color="#f2a900" />
              <h2 className="sec-header-title sec-title-17">
                Visor de Inspección de Carta Digitalizada
              </h2>
            </div>
            <p className="sec-header-meta">
              Trámite {solicitud.id} — {solicitud.solicitanteEntidad} ({solicitud.tipo})
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Cerrar visor"
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Barra de Herramientas Interactivas: Zoom, Rotación e Inspección */}
        <div className="sec-drawer-toolbar">
          <div className="sec-toolbar-group">
            <span className="sec-cell-sub">
              HERRAMIENTAS:
            </span>

            {/* Rotar 90° */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotar}
              title="Rotar 90 grados en sentido horario"
            >
              <RotateCw size={15} /> Rotar ({rotacion}°)
            </Button>

            {/* Zoom Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              title="Reducir zoom"
            >
              <ZoomOut size={15} />
            </Button>

            <span className="sec-cell-main">
              {Math.round(zoom * 100)}%
            </span>

            {/* Zoom In */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              title="Aumentar zoom"
            >
              <ZoomIn size={15} />
            </Button>

            {/* Reset */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Restablecer vista a 100%"
            >
              <Maximize2 size={15} /> Reset
            </Button>

            {/* Modo Paneo / Inspección de firmas */}
            <Button
              variant={modoPan ? "primary" : "outline"}
              size="sm"
              onClick={() => setModoPan(!modoPan)}
              title="Activar arrastre para inspeccionar sellos y firmas"
            >
              <Move size={15} />
              <span>{modoPan ? "Inspección Activa (Arrastra)" : "Modo Inspección Sellos"}</span>
            </Button>
          </div>

          <Badge status="neutral">
            <Stamp size={14} color="#191A7D" />
            <span>{doc.selloFisico}</span>
          </Badge>
        </div>

        {/* Área de Visualización del Documento (Lienzo interactivo) */}
        <div
          className={`sec-viewer-canvas ${
            modoPan ? (isDragging ? "sec-cursor-grabbing" : "sec-cursor-grab") : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={paperRef}
            className="sec-viewer-paper"
          >
            {/* Membrete Oficial UAGRM en el documento */}
            <div className="sec-paper-letterhead">
              <div className="sec-cell-accent sec-letterspacing-1">
                UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
              </div>
              <div className="sec-cell-sub">
                Módulo Secretaría General — Ventanilla Única de Admisión
              </div>
            </div>

            {/* Título de la Carta */}
            <h3 className="sec-cell-main sec-mb-5 sec-text-center sec-title-16">
              {doc.titulo}
            </h3>

            {/* Contenido del texto escaneado */}
            <div className="sec-mb-6 sec-scanned-text">
              {doc.contenidoTexto}
            </div>

            {/* Sello Seco y Firma Digital Verificada (Inspección física) */}
            <div className="sec-paper-stamp">
              <Stamp size={24} color="#191A7D" />
              <span>SELLO OFICIAL</span>
              <span className="sec-stamp-sub">U.A.G.R.M.</span>
              <span className="sec-stamp-verified">✓ RECEPCIONADO</span>
            </div>

            {/* Marca de agua institucional de fondo */}
            <div className="sec-paper-watermark">
              UAGRM LEGAL
            </div>
          </div>
        </div>

        {/* Barra de Decisión Rápida (Pie del Drawer) */}
        <BarraDecision
          solicitud={solicitud}
          onAprobar={(id) => {
            onAprobar(id);
            onClose();
          }}
          onRechazar={(id, obs) => {
            const ok = onRechazar(id, obs);
            if (ok) onClose();
            return ok;
          }}
        />
      </div>
    </div>
  );
}
