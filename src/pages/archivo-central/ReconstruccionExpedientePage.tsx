import { useParams, useNavigate } from 'react-router-dom';
import { OCRViewer } from '../../features/visor-ocr/ui/OCRViewer';
import { Button } from '../../shared/ui/Button/Button';

export function ReconstruccionExpedientePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // En un caso real, harías un fetch para obtener la URL del documento basado en el ID
  // Por ahora simularemos los datos del expediente.
  const documentUrl = `${import.meta.env.VITE_MINIO_PUBLIC_URL || 'http://localhost:10001'}/uagrm-expedientes/sample-document.pdf`;
  const documentName = `Expediente-${id}.pdf`;

  if (!id) {
    return <div>Error: ID de expediente no proporcionado</div>;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="ghost" onClick={() => navigate('/archivo/pendientes')}>
          ← Volver a Pendientes
        </Button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Validación de Expediente: {id}</h1>
      </header>

      {/* El componente OCRViewer ya contiene el layout de Pantalla Dividida (Split-Screen) */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <OCRViewer
          documentoId={id}
          documentUrl={documentUrl}
          documentName={documentName}
        />
      </div>
    </div>
  );
}
