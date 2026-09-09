import { useState, useCallback, useRef, type DragEvent } from 'react';
import { ProgressBar } from '../../../shared/ui/ProgressBar/ProgressBar';
import { Button } from '../../../shared/ui/Button/Button';
import { usePresignedUpload } from '../api/usePresignedUpload';
import './UploadDropzone.css';

interface UploadDropzoneProps {
  readonly unidadId: string;
  readonly repositorioId: string;
  readonly accept?: string;
  readonly maxSizeMb?: number;
  readonly onUploadComplete?: () => void;
}

export function UploadDropzone({
  unidadId,
  repositorioId,
  accept = '.pdf,.jpg,.jpeg,.png,.tiff',
  maxSizeMb = 50,
  onUploadComplete,
}: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, upload, reset } = usePresignedUpload();

  const validateAndUpload = useCallback(
    async (file: File) => {
      if (file.size > maxSizeMb * 1024 * 1024) {
        return;
      }
      await upload(file, unidadId, repositorioId);
      onUploadComplete?.();
    },
    [upload, unidadId, repositorioId, maxSizeMb, onUploadComplete],
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        void validateAndUpload(file);
      }
    },
    [validateAndUpload],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        void validateAndUpload(file);
      }
    },
    [validateAndUpload],
  );

  if (state.isComplete) {
    return (
      <div className="upload-dropzone">
        <div className="upload-dropzone__success">
          <svg className="upload-dropzone__success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <span className="upload-dropzone__success-text">Archivo subido exitosamente</span>
          <Button variant="ghost" size="sm" onClick={reset}>
            Subir otro archivo
          </Button>
        </div>
      </div>
    );
  }

  const zoneClasses = [
    'upload-dropzone',
    isDragActive ? 'upload-dropzone--active' : '',
    state.error ? 'upload-dropzone--error' : '',
    state.isUploading ? 'upload-dropzone--uploading' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={zoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      aria-label="Zona de carga de archivos"
    >
      <input
        ref={inputRef}
        type="file"
        className="upload-dropzone__input"
        accept={accept}
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {state.isUploading ? (
        <div className="upload-dropzone__progress">
          <ProgressBar
            value={state.progress}
            label="Subiendo archivo"
            color="primary"
          />
        </div>
      ) : (
        <>
          <svg className="upload-dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="upload-dropzone__text">
            Arrastra un archivo aquí o <strong>haz clic para seleccionar</strong>
          </p>
          <span className="upload-dropzone__hint">
            PDF, JPG, PNG, TIFF · Máximo {maxSizeMb} MB
          </span>
        </>
      )}

      {state.error && (
        <span className="upload-dropzone__error" role="alert">
          {state.error}
        </span>
      )}
    </div>
  );
}
