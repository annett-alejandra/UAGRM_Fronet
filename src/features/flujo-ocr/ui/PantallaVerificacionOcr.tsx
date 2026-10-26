import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody } from '../../../shared/ui/Card/Card';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { Badge } from '../../../shared/ui/Badge/Badge';
import { ocrApi, type DocumentResponse } from '../api/ocr-api';

export function PantallaVerificacionOcr() {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<DocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;
    
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const data = await ocrApi.consultarEstadoDocumento(docId);
        if (!isMounted) return;
        
        setDoc(data);
        if (data.status === 'PROCESSING' || data.status === 'PENDING') {
          setTimeout(checkStatus, 3000); // Polling cada 3 segs
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      }
    };
    
    checkStatus();
    
    return () => { isMounted = false; };
  }, [docId]);

  return (
    <div className="p-6">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
        
        {/* Lado Izquierdo: PDF Viewer */}
        <Card>
          <CardBody style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Documento Original</h3>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
              {doc ? (
                <p style={{ color: 'var(--text-tertiary)' }}>Visor PDF Simulador<br/><small>{doc.object_key}</small></p>
              ) : <Spinner />}
            </div>
          </CardBody>
        </Card>

        {/* Lado Derecho: OCR Text */}
        <Card>
          <CardBody style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Texto Extrado (OCR)</h3>
              {doc?.status === 'PROCESSING' && <Badge variant="warning" showDot>Analizando...</Badge>}
              {doc?.status === 'DONE' && <Badge variant="success">Anlisis Completo</Badge>}
            </div>
            
            <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', overflowY: 'auto', border: '1px solid var(--border-color)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
              {doc?.status === 'DONE' ? doc.extracted_text : 'La Inteligencia Artificial est procesando el documento...'}
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}
