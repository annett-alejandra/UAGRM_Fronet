import { useState, useEffect } from 'react';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { Button } from '../../shared/ui/Button/Button';
import { Modal } from '../../shared/ui/Modal/Modal';
import { EmptyState } from '../../shared/ui/EmptyState/EmptyState';
import { Spinner } from '../../shared/ui/Spinner/Spinner';
import { DocumentoCard, type DocumentoEntity } from '../../entities/documento';
import { UploadDropzone } from '../../features/subir-documento';
import { restClient } from '../../shared/api/rest-client';
import './DocumentosPage.css';

export function DocumentosPage() {
  const [documentos, setDocumentos] = useState<readonly DocumentoEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocumentos = async () => {
    try {
      const { data } = await restClient.get<readonly DocumentoEntity[]>('/documents/');
      setDocumentos(data);
    } catch {
      /* handled */
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDocumentos();
  }, []);

  return (
    <SidebarNavWidget pageTitle="Documentos">
      <div className="documentos-page">
        <div className="documentos-page__header">
          <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
          </span>
          <Button variant="primary" size="sm" onClick={() => setShowUpload(true)}>
            + Subir Documento
          </Button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Spinner size="lg" />
          </div>
        ) : documentos.length === 0 ? (
          <EmptyState
            title="Sin documentos"
            description="Sube tu primer documento para iniciar el proceso de digitalización y OCR."
            action={
              <Button variant="primary" size="sm" onClick={() => setShowUpload(true)}>
                Subir Documento
              </Button>
            }
          />
        ) : (
          <div className="documentos-page__grid">
            {documentos.map((doc) => (
              <DocumentoCard key={doc.id} documento={doc} />
            ))}
          </div>
        )}

        <Modal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          title="Subir Documento"
          size="lg"
        >
          <UploadDropzone
            unidadId="default"
            repositorioId="default"
            onUploadComplete={() => {
              setShowUpload(false);
              void fetchDocumentos();
            }}
          />
        </Modal>
      </div>
    </SidebarNavWidget>
  );
}
