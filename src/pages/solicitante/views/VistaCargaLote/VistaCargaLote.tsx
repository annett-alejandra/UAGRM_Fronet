import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  Send,
  Check,
  X,
  FileText,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { Button, Card, Badge, Modal } from '@/shared/ui';

export interface PostulanteItem {
  id: string;
  ci: string;
  nombre: string;
  carrera: string;
  requisitos: {
    ci: boolean;
    titulo: boolean;
    solicitud: boolean;
    arancel: boolean;
  };
  detalleFaltantes: string[];
}

export function VistaCargaLote() {
  const [postulantes, setPostulantes] = useState<PostulanteItem[]>([]);
  const [filtroTab, setFiltroTab] = useState<'todos' | 'completos' | 'observados'>('todos');
  const [modalAislamientoAbierto, setModalAislamientoAbierto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loteDespachado, setLoteDespachado] = useState<{
    codigoLote: string;
    totalEnviados: number;
    retenidos: number;
  } | null>(null);

  // Calcular cumplimiento de los 4 requisitos oficiales (X/4)
  const contarRequisitos = (req: PostulanteItem['requisitos']) => {
    let count = 0;
    if (req.ci) count++;
    if (req.titulo) count++;
    if (req.solicitud) count++;
    if (req.arancel) count++;
    return count;
  };

  const postulantesValidos = postulantes.filter((p) => contarRequisitos(p.requisitos) === 4);
  const postulantesObservados = postulantes.filter((p) => contarRequisitos(p.requisitos) < 4);

  const postulantesFiltrados = postulantes.filter((p) => {
    const totalReq = contarRequisitos(p.requisitos);
    if (filtroTab === 'completos') return totalReq === 4;
    if (filtroTab === 'observados') return totalReq < 4;
    return true;
  });

  // Procesar archivos reales seleccionados o arrastrados
  const procesarArchivos = (archivos: FileList | File[]) => {
    const nuevos: PostulanteItem[] = Array.from(archivos)
      .filter((file) => file.name.toLowerCase().endsWith('.pdf'))
      .map((file, idx) => {
        const nombreArchivo = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        return {
          id: `post-${Date.now()}-${idx}`,
          ci: 'Pendiente de extracción',
          nombre: nombreArchivo,
          carrera: 'Expediente digital',
          requisitos: {
            ci: true,
            titulo: true,
            solicitud: true,
            arancel: true,
          },
          detalleFaltantes: [],
        };
      });

    if (nuevos.length > 0) {
      setPostulantes((prev) => [...nuevos, ...prev]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      procesarArchivos(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      procesarArchivos(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleVaciarLote = () => {
    setPostulantes([]);
    setFiltroTab('todos');
  };

  // Subsanar un registro observado in situ
  const handleSubsanarRegistro = (id: string) => {
    setPostulantes((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            requisitos: {
              ci: true,
              titulo: true,
              solicitud: true,
              arancel: true,
            },
            detalleFaltantes: [],
          };
        }
        return p;
      })
    );
  };

  const handleConfirmarEnvioClick = () => {
    if (postulantesObservados.length > 0) {
      setModalAislamientoAbierto(true);
    } else {
      despacharLote(postulantesValidos.length, 0);
    }
  };

  const despacharLote = (enviados: number, retenidos: number) => {
    const correlativo = Math.floor(100 + Math.random() * 900);
    setLoteDespachado({
      codigoLote: `LOTE-UAGRM-2026-${correlativo}`,
      totalEnviados: enviados,
      retenidos: retenidos,
    });
    setModalAislamientoAbierto(false);

    if (retenidos > 0) {
      setPostulantes(postulantesObservados);
      setFiltroTab('observados');
    } else {
      setPostulantes([]);
      setFiltroTab('todos');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input de archivos oculto para carga real */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Cabecera del Módulo */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#191A7D] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-[#191A7D]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#191A7D] tracking-tight">
              Módulo de Carga Masiva y Pre-Auditoría por Lote
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Auditoría automatizada de los <strong className="text-slate-700 font-semibold">4 requisitos reglamentarios</strong> por expediente para postulantes e instituciones afiliadas.
          </p>
        </div>

        {postulantes.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVaciarLote}
            className="text-slate-600 hover:text-rose-600 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-xs gap-1.5 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar Lote Actual
          </Button>
        )}
      </div>

      {/* Métricas Superiores Unificadas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Postulantes
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#191A7D] mt-0.5">
              {postulantes.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#191A7D]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Conformes (4/4 Requisitos)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-0.5">
              {postulantesValidos.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-rose-200/80 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Observados (Incompletos)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-0.5">
              {postulantesObservados.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tarjeta Principal de Gestión */}
      <Card className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
        {/* Zona de Carga Superior Optimizada (Drag & Drop) */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed transition-all rounded-2xl py-6 px-6 text-center cursor-pointer group ${
            isDragging
              ? 'border-[#191A7D] bg-blue-50/50 scale-[1.005]'
              : 'border-slate-300 hover:border-[#191A7D] bg-slate-50 hover:bg-blue-50/30'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#191A7D] mx-auto mb-2.5 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6 text-[#191A7D]" />
          </div>
          <div className="text-sm font-semibold text-slate-800">
            Arrastra los expedientes en PDF aquí o haz clic para examinar
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-lg mx-auto">
            Soporta hasta 500 legajos digitales por institución. El sistema audita automáticamente los 4 requisitos normativos oficiales.
          </p>
        </div>

        {/* Filtros de Pestañas Superiores y Acción de Despacho */}
        <div className="flex justify-between items-center flex-wrap gap-3 pt-1">
          {/* Pills de Filtrado */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
            <button
              type="button"
              onClick={() => setFiltroTab('todos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroTab === 'todos'
                  ? 'bg-[#191A7D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Todos ({postulantes.length})
            </button>

            <button
              type="button"
              onClick={() => setFiltroTab('completos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroTab === 'completos'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Completos ({postulantesValidos.length})
            </button>

            <button
              type="button"
              onClick={() => setFiltroTab('observados')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtroTab === 'observados'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
              }`}
            >
              Observados / Subsanar ({postulantesObservados.length})
            </button>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirmarEnvioClick}
            disabled={postulantes.length === 0}
            className="bg-[#191A7D] hover:bg-[#2B6CB0] gap-2 rounded-xl text-xs font-semibold h-9 px-4"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirmar Envío de Lote</span>
          </Button>
        </div>

        {/* Listado en Tarjetas de Postulantes (Cards SaaS) */}
        <div className="space-y-3 pt-2">
          {postulantesFiltrados.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No hay registros en esta categoría.</p>
              <p className="text-xs text-slate-400 mt-0.5">Selecciona otra pestaña o sube nuevos expedientes.</p>
            </div>
          ) : (
            postulantesFiltrados.map((p) => {
              const totalReq = contarRequisitos(p.requisitos);
              const esCompleto = totalReq === 4;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3.5"
                >
                  {/* Fila Superior: Datos del Postulante + Estado + Acción */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                          {p.nombre}
                        </h3>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          {p.ci}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {p.carrera}
                      </div>

                      {/* Texto sutil de alerta en caso de faltantes */}
                      {!esCompleto && p.detalleFaltantes.length > 0 && (
                        <div className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-0.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Observación: {p.detalleFaltantes.join(' • ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Semáforo Unificado y Acción */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {esCompleto ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          Observado ({totalReq}/4)
                        </span>
                      )}

                      {!esCompleto && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubsanarRegistro(p.id)}
                          className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50 h-7 px-2.5 rounded-lg"
                        >
                          Subsanar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fila Inferior: Badges Minimalistas de los 4 Requisitos Oficiales */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                    {/* 1. C.I. */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        p.requisitos.ci
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.requisitos.ci ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <X className="w-3 h-3 text-rose-600 stroke-[2.5]" />
                      )}
                      C.I.
                    </span>

                    {/* 2. Título A/R */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        p.requisitos.titulo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.requisitos.titulo ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <X className="w-3 h-3 text-rose-600 stroke-[2.5]" />
                      )}
                      Título A/R
                    </span>

                    {/* 3. Solicitud */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        p.requisitos.solicitud
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.requisitos.solicitud ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <X className="w-3 h-3 text-rose-600 stroke-[2.5]" />
                      )}
                      Solicitud
                    </span>

                    {/* 4. Arancel */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        p.requisitos.arancel
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.requisitos.arancel ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <X className="w-3 h-3 text-rose-600 stroke-[2.5]" />
                      )}
                      Arancel (Bs. 30)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Modal de Advertencia y Aislamiento de Errores */}
      {modalAislamientoAbierto && (
        <Modal
          isOpen={true}
          onClose={() => setModalAislamientoAbierto(false)}
          title="Aislamiento de Registros Observados"
          size="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setModalAislamientoAbierto(false)}>
                Cancelar y Revisar
              </Button>
              <Button
                variant="primary"
                onClick={() => despacharLote(postulantesValidos.length, postulantesObservados.length)}
                className="bg-[#191A7D] text-white hover:bg-[#2B6CB0]"
              >
                Despachar {postulantesValidos.length} Válidos y Aislar Observados
              </Button>
            </div>
          }
        >
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Atención: Se detectaron {postulantesObservados.length} postulantes con requisitos pendientes.</strong>
                <p className="mt-1 text-slate-600">
                  ¿Desea enviar los <strong className="text-emerald-700 font-semibold">{postulantesValidos.length} expedientes conformes</strong> a Secretaría General y mantener los <strong className="text-rose-700 font-semibold">{postulantesObservados.length} observados</strong> en la pestaña local para su subsanación?
                </p>
              </div>
            </div>

            <div className="text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Registros a radicar oficialmente:</span>
                <strong className="text-emerald-700 font-semibold">{postulantesValidos.length} expedientes completos (4/4)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Registros que quedarán retenidos:</span>
                <strong className="text-rose-700 font-semibold">{postulantesObservados.length} expedientes observados</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Lote Radicado Exitosamente */}
      {loteDespachado && (
        <Modal
          isOpen={true}
          onClose={() => setLoteDespachado(null)}
          title="Lote Radicado Oficialmente"
          size="md"
          footer={
            <Button variant="primary" onClick={() => setLoteDespachado(null)} className="bg-[#191A7D]">
              Cerrar y Continuar
            </Button>
          }
        >
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-[#191A7D]">Lote Despachado a Secretaría General</h3>
            <div className="text-base font-mono font-bold text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg inline-block border border-slate-200">
              {loteDespachado.codigoLote}
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Se han despachado <strong className="text-emerald-700 font-semibold">{loteDespachado.totalEnviados} expedientes</strong> con el 100% de los 4 requisitos reglamentarios cumplidos.
              {loteDespachado.retenidos > 0 && ` Los ${loteDespachado.retenidos} expedientes observados permanecen aislados en la pestaña "Observados / Subsanar".`}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

