import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Input, ProgressBar } from '@/shared/ui';
import { ocrApi } from '../api/ocrApi';

export function CargadorOcrWizard() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState('');
  const [departamentoId] = useState('uuid-generico-uagrm');

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
      // PASO 0: Solicitar firma de URL
      setStatusText('Obteniendo firma de seguridad...');
      setProgress(10);
      const presign = await ocrApi.pedirUrlPrefirmada({
        organizational_unit_id: departamentoId,
        filename: file.name,
        content_type: file.type || 'application/pdf',
      });

      // PASO 1: Registrar metadata del documento
      setStatusText('Registrando expediente...');
      setProgress(20);
      const doc = await ocrApi.registrarDocumento({
        department_id: departamentoId,
        title: titulo,
        object_key: presign.object_key,
        content_type: file.type || 'application/pdf',
        file_size_bytes: file.size,
      });

      // PASO 2: Subir archivo binario
      setStatusText('Subiendo archivo a MinIO...');
      await ocrApi.subirPdfAMinio(presign.upload_url, file, (pct) => {
        setProgress(20 + Math.floor(pct * 0.8));
      });

      setStatusText('Archivo subido. Procesando OCR...');
      setProgress(100);

      // PASO 3: Redirigir a verificación
      setTimeout(() => {
        navigate('/archivo/verificar-ocr/' + doc.id);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la subida y procesamiento';
      setError(msg);
      setStep(1);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2 className="text-lg font-bold text-[#191A7D] mb-4">
          Subir Nuevo Expediente (Pipeline OCR)
        </h2>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Título del Expediente"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Título Supletorio Juan Pérez"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Archivo PDF Digitalizado
              </label>
              <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>

            {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

            <div className="mt-2">
              <Button variant="primary" onClick={iniciarSubida} disabled={!file || !titulo.trim()}>
                Iniciar Subida y OCR
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 text-center space-y-4">
            <p className="text-sm font-medium text-slate-600">{statusText}</p>
            <ProgressBar progress={progress} variant="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default CargadorOcrWizard;
