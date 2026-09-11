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
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 flex items-center justify-center h-full text-slate-500 font-medium">
        Seleccione un documento del dossier
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Controls Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md px-5 py-3.5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-white truncate max-w-[240px]">
            {selectedDoc.nombre_archivo}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center justify-center text-sm" title="Zoom Out">-</button>
          <span className="font-mono px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-blue-400 font-bold">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center justify-center text-sm" title="Zoom In">+</button>
          <span className="w-px h-4 bg-slate-800 mx-1"></span>
          <button onClick={() => setRotation(r => (r + 90) % 360)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs" title="Rotar 90°">🔄 Rotar</button>
          <button onClick={() => setZoom(100)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs" title="Reset">🎯 100%</button>
        </div>
      </div>

      {/* PDF View Canvas */}
      <div className="flex-1 bg-slate-950 p-6 overflow-auto flex justify-center items-center relative">
        <div 
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          className="w-[180mm] min-h-[250mm] bg-white shadow-2xl p-8 text-slate-900 transition-transform duration-200 rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <h2 className="text-xs font-black font-serif uppercase tracking-widest text-slate-900">UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO</h2>
                <p className="text-[9px] text-slate-500 font-sans">MinIO Presigned Storage Engine</p>
              </div>
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold border border-blue-200">{selectedDoc.tipo_documento}</span>
            </div>

            <div className="space-y-4 text-xs font-serif leading-relaxed">
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl font-sans text-[11px]">
                <strong className="text-blue-900">DOCUMENTO EN DOSSIER:</strong> {selectedDoc.nombre_archivo}<br />
                <strong className="text-blue-900">MinIO Key:</strong> <span className="font-mono text-blue-700">{selectedDoc.minio_object_key}</span><br />
                <strong className="text-blue-900">Presigned URL:</strong> <span className="font-mono text-[10px] text-slate-500 truncate block max-w-md">{presignedUrl}</span>
              </div>

              <div className="border border-slate-200 p-4 space-y-2 font-mono text-[11px] bg-slate-50 rounded-xl">
                <div>• Documento ID: {selectedDoc.documento_id}</div>
                <div>• OCR Completado: {selectedDoc.ocr_completado ? 'Sí (100%)' : 'En proceso'}</div>
                <div>• Fecha Subida: {new Date(selectedDoc.fecha_subida).toLocaleString()}</div>
              </div>

              <div className="h-36 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-sans">
                [ Documento PDF firmado digitalmente en MinIO Storage ]
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] font-sans text-slate-500">
            <span>Servidor MinIO - UAGRM Storage API v1</span>
            <span className="font-bold text-emerald-600">✓ Verificado</span>
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
    <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div>
          <h3 className="font-extrabold text-white text-sm">Tabla del Dossier Digital</h3>
          <p className="text-xs text-slate-400">Endpoint: GET /api/v1/expedientes/{`{id}`}/dossier/</p>
        </div>
        <button
          onClick={onIrEmision}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
        >
          ✨ Ir a Emisión de Título
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Tipo Documento</th>
              <th className="p-4">Nombre Archivo</th>
              <th className="p-4">OCR Status</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {dossier.map(doc => {
              const isSelected = doc.documento_id === selectedDocId;
              return (
                <tr
                  key={doc.documento_id}
                  onClick={() => onSelectDoc(doc)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-500/10 border-l-4 border-blue-500 font-semibold'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <td className="p-4 font-bold text-white text-xs">{doc.tipo_documento}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{doc.nombre_archivo}</td>
                  <td className="p-4 text-xs">
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-extrabold text-[10px]">
                      {doc.ocr_completado ? 'OCR OK' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectDoc(doc); }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
    <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-6">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-2xl p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/titulos/busqueda')} 
            className="px-4 py-2 border border-slate-800 rounded-2xl hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all active:scale-95"
          >
            ← Volver al Panel
          </button>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Expediente Digital: {dossierData?.estudiante.nombre_completo || 'JUAN CARLOS PÉREZ GÓMEZ'}</span>
              <span className="text-xs font-mono px-3 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full font-bold">
                {id || 'c9b1d830'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">CI: {dossierData?.estudiante.ci || '1234567'} | Documentos en Dossier: {dossierData?.documentos.length || 0}</p>
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
