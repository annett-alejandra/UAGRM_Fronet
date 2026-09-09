import { useState } from 'react';
import { type DocumentoEntity, DocumentoEstado } from '../../entities/documento';
import { Badge } from '../../shared/ui/Badge/Badge';
import { OCRViewer } from '../../features/visor-ocr';
import { formatFileSize, formatDateTime } from '../../shared/lib/format';
import './VisorDocumentoWidget.css';

type TabKey = 'preview' | 'ocr' | 'metadata';

interface VisorDocumentoWidgetProps {
  readonly documento: DocumentoEntity;
  readonly documentUrl: string;
}

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';

function getEstadoBadge(estado: DocumentoEstado): { label: string; variant: BadgeVariant } {
  switch (estado) {
    case DocumentoEstado.PENDING: return { label: 'Pendiente', variant: 'warning' };
    case DocumentoEstado.PROCESSING: return { label: 'Procesando', variant: 'info' };
    case DocumentoEstado.DONE: return { label: 'Completado', variant: 'success' };
    case DocumentoEstado.ERROR: return { label: 'Error', variant: 'error' };
  }
}

const TABS: readonly { key: TabKey; label: string }[] = [
  { key: 'preview', label: 'Vista Previa' },
  { key: 'ocr', label: 'Texto OCR' },
  { key: 'metadata', label: 'Metadatos' },
];

export function VisorDocumentoWidget({ documento, documentUrl }: VisorDocumentoWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('preview');
  const badge = getEstadoBadge(documento.estado);

  return (
    <div className="visor-documento-widget">
      <div className="visor-documento-widget__header">
        <h2 className="visor-documento-widget__title">{documento.nombreOriginal}</h2>
        <Badge variant={badge.variant} showDot>{badge.label}</Badge>
      </div>

      <div className="visor-documento-widget__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`visor-documento-widget__tab ${activeTab === tab.key ? 'visor-documento-widget__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'preview' && (
        <iframe
          src={documentUrl}
          title={`Vista previa: ${documento.nombreOriginal}`}
          style={{ width: '100%', height: 600, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}
        />
      )}

      {activeTab === 'ocr' && (
        <OCRViewer
          documentoId={documento.id}
          documentUrl={documentUrl}
          documentName={documento.nombreOriginal}
        />
      )}

      {activeTab === 'metadata' && (
        <div className="visor-documento-widget__meta-grid">
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Nombre Original</span>
            <span className="visor-documento-widget__meta-value">{documento.nombreOriginal}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Tipo MIME</span>
            <span className="visor-documento-widget__meta-value">{documento.mimeType}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Tamaño</span>
            <span className="visor-documento-widget__meta-value">{formatFileSize(documento.tamanoBytes)}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Bucket</span>
            <span className="visor-documento-widget__meta-value">{documento.minioBucket}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Object Key</span>
            <span className="visor-documento-widget__meta-value">{documento.minioObjectKey}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Creado</span>
            <span className="visor-documento-widget__meta-value">{formatDateTime(documento.createdAt)}</span>
          </div>
          <div className="visor-documento-widget__meta-item">
            <span className="visor-documento-widget__meta-label">Actualizado</span>
            <span className="visor-documento-widget__meta-value">{formatDateTime(documento.updatedAt)}</span>
          </div>
          {documento.ocrConfianza !== null && (
            <div className="visor-documento-widget__meta-item">
              <span className="visor-documento-widget__meta-label">Confianza OCR</span>
              <span className="visor-documento-widget__meta-value">{documento.ocrConfianza}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
