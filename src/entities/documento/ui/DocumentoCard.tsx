import { Badge } from '../../../shared/ui/Badge/Badge';
import { formatFileSize, formatRelativeTime } from '../../../shared/lib/format';
import { type DocumentoEntity, DocumentoEstado } from '../model/types';
import './DocumentoCard.css';

interface DocumentoCardProps {
  readonly documento: DocumentoEntity;
  readonly onClick?: (doc: DocumentoEntity) => void;
}

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';

function getEstadoBadge(estado: DocumentoEstado): { label: string; variant: BadgeVariant } {
  switch (estado) {
    case DocumentoEstado.PENDING:
      return { label: 'Pendiente', variant: 'warning' };
    case DocumentoEstado.PROCESSING:
      return { label: 'Procesando', variant: 'info' };
    case DocumentoEstado.DONE:
      return { label: 'Completado', variant: 'success' };
    case DocumentoEstado.ERROR:
      return { label: 'Error', variant: 'error' };
  }
}

function getFileTypeIcon(mimeType: string): { label: string; className: string } {
  if (mimeType.includes('pdf')) return { label: 'PDF', className: 'documento-card__icon--pdf' };
  if (mimeType.startsWith('image/')) return { label: 'IMG', className: 'documento-card__icon--image' };
  if (mimeType.includes('word') || mimeType.includes('document')) return { label: 'DOC', className: 'documento-card__icon--doc' };
  return { label: 'FILE', className: 'documento-card__icon--other' };
}

export function DocumentoCard({ documento, onClick }: DocumentoCardProps) {
  const badge = getEstadoBadge(documento.estado);
  const icon = getFileTypeIcon(documento.mimeType);

  return (
    <div
      className="documento-card"
      onClick={onClick ? () => onClick(documento) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(documento); } : undefined}
    >
      <div className={`documento-card__icon ${icon.className}`} aria-hidden="true">
        {icon.label}
      </div>
      <div className="documento-card__info">
        <div className="documento-card__name" title={documento.nombreOriginal}>
          {documento.nombreOriginal}
        </div>
        <div className="documento-card__meta">
          <span>{formatFileSize(documento.tamanoBytes)}</span>
          <span>·</span>
          <span>{formatRelativeTime(documento.createdAt)}</span>
        </div>
      </div>
      <div className="documento-card__badge">
        <Badge variant={badge.variant} showDot>{badge.label}</Badge>
      </div>
    </div>
  );
}
