import { useEffect, useState } from 'react';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { Badge } from '../../../shared/ui/Badge/Badge';
import { Button } from '../../../shared/ui/Button/Button';
import { Input } from '../../../shared/ui/Input/Input';
import { useDocumentOCR } from '../api/useDocumentOCR';
import { useValidarYConsolidarDocumento } from '../api/useValidarYConsolidarDocumento';
import './OCRViewer.css';

interface OCRViewerProps {
  readonly documentoId: string;
  readonly documentUrl: string;
  readonly documentName: string;
}

export function OCRViewer({ documentoId, documentUrl, documentName }: OCRViewerProps) {
  const { isLoading, data, error: fetchError, fetchOcr, rejectOcr } = useDocumentOCR();
  const { consolidarDocumento, isSaving, error: mutationError } = useValidarYConsolidarDocumento();
  
  // Local state to hold the editable guesses
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    void fetchOcr(documentoId);
  }, [documentoId, fetchOcr]);

  useEffect(() => {
    // Cuando llegan los datos del OCR (ocr_guesses), los seteamos en el estado local editable.
    // Ojo: si hay keys anidadas el backend las enviará planas o nosotros nos aseguramos que sean planas.
    if (data?.ocr_guesses) {
      setFormData(data.ocr_guesses as Record<string, string>);
      setIsValidated(false);
    }
  }, [data]);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleConfirm = async () => {
    if (!data) return;
    
    // Binding JSON: Empaquetar todo el payload y extraer un C.I. (carnet_identidad o similar)
    // Buscamos dinámicamente cualquier key que parezca CI
    const ciKey = Object.keys(formData).find(k => k.toLowerCase().includes('ci') || k.toLowerCase().includes('carnet'));
    const ciEstudiante = ciKey ? formData[ciKey] : 'S/N';

    const success = await consolidarDocumento(documentoId, formData, ciEstudiante);
    if (success) {
      setIsValidated(true);
    } else {
      // Mock Local Fallback: Como pediste, si el servidor está vacío, simulamos el éxito.
      console.warn("Apollo Server is likely disconnected. Mocking success for UI flow.");
      setIsValidated(true);
    }
  };

  const handleReject = async () => {
    if (!data) return;
    const reason = window.prompt('¿Cuál es el motivo del rechazo? (Ej. Imagen borrosa, incompleta)');
    if (reason && reason.trim() !== '') {
      await rejectOcr(documentoId, reason);
      alert('Documento devuelto por deficiencia.');
    }
  };

  const handlePrintPDF = () => {
    // Abrir PDF estático genérico de prueba (bypass popup blockers checking)
    const staticPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    window.open(staticPdfUrl, '_blank', 'noopener,noreferrer');
  };

  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="ocr-viewer">
      {/* Left Panel: Document Preview */}
      <div className="ocr-viewer__panel">
        <div className="ocr-viewer__panel-header">
          <span>Documento Original</span>
          <span className="ocr-viewer__panel-badge">{documentName}</span>
        </div>
        <iframe
          className="ocr-viewer__document-frame"
          src={documentUrl}
          title={`Vista previa de ${documentName}`}
        />
      </div>

      {/* Right Panel: Extracted OCR Text & Validation Form */}
      <div className="ocr-viewer__panel ocr-viewer__panel--interactive">
        <div className="ocr-viewer__panel-header">
          <span>Validación OCR</span>
          {data?.confianza && (
            <Badge variant={data.confianza >= 80 ? 'success' : 'warning'} size="sm">
              {data.confianza.toFixed(0)}% confianza
            </Badge>
          )}
        </div>

        {isLoading && (
          <div className="ocr-viewer__loading">
            <Spinner size="lg" label="Extrayendo datos OCR..." />
          </div>
        )}

        {(fetchError || mutationError) && (
          <div className="ocr-viewer__error" role="alert">
            {fetchError || mutationError?.message}
          </div>
        )}

        {data && !isLoading && (
          <div className="ocr-viewer__form-container">
            <div className="ocr-viewer__fields">
              <p className="ocr-viewer__instruction">
                Revise la información extraída y corrija los errores si es necesario.
              </p>
              
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="ocr-viewer__field-wrapper">
                  <Input
                    label={formatLabel(key)}
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    disabled={isValidated || isSaving}
                  />
                </div>
              ))}
            </div>

            <div className="ocr-viewer__actions">
              {isValidated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <div className="ocr-viewer__success-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Validado por humano</span>
                  </div>
                  
                  <Button 
                    variant="accent" 
                    isFullWidth 
                    onClick={handlePrintPDF}
                  >
                    Generar Informe de Veracidad
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <Button 
                    variant="danger" 
                    onClick={handleReject} 
                    disabled={isSaving}
                    style={{ flex: 1 }}
                  >
                    Devolver (Deficiencia)
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleConfirm} 
                    isLoading={isSaving}
                    style={{ flex: 1 }}
                  >
                    Validar y Guardar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

