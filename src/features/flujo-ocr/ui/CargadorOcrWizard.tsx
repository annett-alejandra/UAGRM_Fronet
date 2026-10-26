import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../../shared/ui/Card/Card';
import { Button } from '../../../shared/ui/Button/Button';
import { Input } from '../../../shared/ui/Input/Input';
import { ProgressBar } from '../../../shared/ui/ProgressBar/ProgressBar';
import { ocrApi } from '../api/ocr-api';

export function CargadorOcrWizard() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState('');
  const [departamentoId, setDepartamentoId] = useState('uuid-generico-uagrm');
  
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Esperando archivo...');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const iniciarSubida = async () => {
    if (!file || !titulo) return;
    setStep(2);
    setError(null);
    try {
      // PASO 0
      setStatusText('Obteniendo firma de seguridad...');
      setProgress(10);
      const presign = await ocrApi.pedirUrlPrefirmada({
        organizational_unit_id: departamentoId,
        filename: file.name,
        content_type: file.type || 'application/pdf'
      });

      // PASO 1
      setStatusText('Registrando expediente...');
      setProgress(20);
      const doc = await ocrApi.registrarDocumento({
        department_id: departamentoId,
        title: titulo,
        object_key: presign.object_key,
        content_type: file.type || 'application/pdf',
        file_size_bytes: file.size
      });

      // PASO 2
      setStatusText('Subiendo archivo a MinIO...');
      await ocrApi.subirPdfAMinio(presign.upload_url, file, (pct) => {
        setProgress(20 + Math.floor(pct * 0.8)); 
      });

      setStatusText('Archivo subido. Procesando OCR...');
      setProgress(100);
      
      // Pasar a PASO 3 de polling
      setTimeout(() => {
        navigate('/archivo/verificar-ocr/' + doc.id);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Error en la subida');
      setStep(1);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2 style={{ marginBottom: '1rem' }}>Subir Nuevo Expediente (OCR)</h2>
        
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Ttulo del Expediente" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              placeholder="Ej. Ttulo Supletorio Juan Prez" 
            />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Archivo PDF</label>
              <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
            
            {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}
            
            <div style={{ marginTop: '1rem' }}>
              <Button variant="primary" onClick={iniciarSubida} disabled={!file || !titulo}>
                Iniciar Subida y OCR
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>{statusText}</p>
            <ProgressBar progress={progress} variant="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

