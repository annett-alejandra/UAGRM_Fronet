import { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { titulosApi, type DossierDocumento, type DossierResponse } from './api/titulos-api';

const PdfViewerColumn = memo(function PdfViewerColumn({ selectedDoc }: { selectedDoc: DossierDocumento | null }) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [presignedUrl, setPresignedUrl] = useState<string>('');

  useEffect(() => {
    if (!selectedDoc) return;
    let isMounted = true;
    titulosApi.getPresignedViewUrl(selectedDoc.minio_object_key).then(res => {
      if (isMounted) setPresignedUrl(res.url);
    });
    return () => { isMounted = false; };
  }, [selectedDoc]);

  if (!selectedDoc) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center h-full text-slate-500">
        Seleccione un documento del dossier
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-xl">
      {/* Controls Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[220px]">
            {selectedDoc.nombre_archivo}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-1.5 hover:bg-slate-700 rounded font-bold" title="Zoom Out">-</button>
          <span className="font-mono px-1.5 bg-slate-700 rounded text-[11px]">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1.5 hover:bg-slate-700 rounded font-bold" title="Zoom In">+</button>
          <span className="w-px h-4 bg-slate-700 mx-1"></span>
          <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1.5 hover:bg-slate-700 rounded" title="Rotar 90°">🔄</button>
          <button onClick={() => setZoom(100)} className="p-1.5 hover:bg-slate-700 rounded" title="Reiniciar Zoom">🎯</button>
        </div>
      </div>

      {/* PDF View Container */}
      <div className="flex-1 bg-slate-950 p-6 overflow-auto flex justify-center items-center relative">
        <div 
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          className="w-[180mm] min-h-[250mm] bg-white shadow-2xl p-8 text-slate-900 transition-transform duration-200 rounded flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-sm font-bold font-serif uppercase">UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO</h2>
                <p className="text-[10px] text-slate-500 font-sans">MinIO Presigned Storage Engine</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded font-bold">{selectedDoc.tipo_documento}</span>
            </div>

            <div className="space-y-4 text-xs font-serif leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded font-sans text-[11px]">
                <strong>DOCUMENTO DEL DOSSIER:</strong> {selectedDoc.nombre_archivo}<br />
                <strong>MinIO Object Key:</strong> <span className="font-mono text-blue-700">{selectedDoc.minio_object_key}</span><br />
                <strong>Presigned URL:</strong> <span className="font-mono text-[10px] text-slate-500 truncate block max-w-md">{presignedUrl}</span>
              </div>

              <div className="border border-slate-300 p-4 space-y-2 font-mono text-[11px]">
                <div>• Documento ID: {selectedDoc.documento_id}</div>
                <div>• OCR Completado: {selectedDoc.ocr_completado ? 'Sí (100%)' : 'En proceso'}</div>
                <div>• Fecha Subida: {new Date(selectedDoc.fecha_subida).toLocaleString()}</div>
              </div>

              <div className="h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-xs font-sans">
                [ Renderizado de PDF firmado desde MinIO ]
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-3 flex justify-between items-center text-[10px] font-sans text-slate-500">
            <span>Servidor MinIO - UAGRM Storage API v1</span>
            <span>Documento Verificado</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const DossierTableColumn = memo(function DossierTableColumn({
  dossier,
  selectedDocId,
  onSelectDoc,
  onIrEmision
}: {
  dossier: DossierDocumento[];
  selectedDocId: string;
  onSelectDoc: (doc: DossierDocumento) => void;
  onIrEmision: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Tabla del Dossier Digital</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Endpoint: GET /api/v1/expedientes/{`{id}`}/dossier/</p>
        </div>
        <button
          onClick={onIrEmision}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1"
        >
          ✨ Ir a Emisión de Título
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">Tipo Documento</th>
              <th className="p-3.5">Nombre Archivo</th>
              <th className="p-3.5">OCR</th>
              <th className="p-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {dossier.map(doc => {
              const isSelected = doc.documento_id === selectedDocId;
              return (
                <tr
                  key={doc.documento_id}
                  onClick={() => onSelectDoc(doc)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-500 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white text-xs">{doc.tipo_documento}</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">{doc.nombre_archivo}</td>
                  <td className="p-3.5 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {doc.ocr_completado ? 'OCR OK' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectDoc(doc); }}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Viendo' : 'Ver PDF'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export function VisorExpedienteDigital() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dossierData, setDossierData] = useState<DossierResponse | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DossierDocumento | null>(null);

  useEffect(() => {
    let isMounted = true;
    titulosApi.getDossier(id || 'c9b1d830-4e2a-4a55-891d-90c74f51e041').then(res => {
      if (isMounted) {
        setDossierData(res);
        if (res.documentos.length > 0) setSelectedDoc(res.documentos[0]);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/titulos/busqueda')} 
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            ← Volver al Panel
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Expediente: {dossierData?.estudiante.nombre_completo || 'JUAN CARLOS PÉREZ GÓMEZ'}</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-bold">
                {id || 'c9b1d830'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">CI: {dossierData?.estudiante.ci || '1234567'} | Documentos en Dossier: {dossierData?.documentos.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] overflow-hidden">
        <PdfViewerColumn selectedDoc={selectedDoc} />
        <DossierTableColumn
          dossier={dossierData?.documentos || []}
          selectedDocId={selectedDoc?.documento_id || ''}
          onSelectDoc={setSelectedDoc}
          onIrEmision={() => navigate(`/titulos/emision?nombre=${encodeURIComponent(dossierData?.estudiante.nombre_completo || '')}&ci=${encodeURIComponent(dossierData?.estudiante.ci || '')}&expedienteId=${id}`)}
        />
      </div>
    </div>
  );
}
