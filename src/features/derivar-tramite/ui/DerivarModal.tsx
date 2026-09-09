import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal/Modal';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { useDerivarTramite } from '../api/useDerivarTramite';
import './DerivarModal.css';

interface DerivarModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tramiteId: string;
  readonly tramiteCodigo: string;
  readonly onSuccess?: () => void;
}

export function DerivarModal({
  isOpen,
  onClose,
  tramiteId,
  tramiteCodigo,
  onSuccess,
}: DerivarModalProps) {
  const [destinoUnidadId, setDestinoUnidadId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const { isSubmitting, error, derivarTramite } = useDerivarTramite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinoUnidadId.trim()) return;

    const result = await derivarTramite(tramiteId, destinoUnidadId, observaciones);
    if (result) {
      setDestinoUnidadId('');
      setObservaciones('');
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Derivar Trámite ${tramiteCodigo}`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!destinoUnidadId.trim()}
          >
            Derivar
          </Button>
        </>
      }
    >
      <form className="derivar-modal__body" onSubmit={handleSubmit}>
        <div className="derivar-modal__info">
          <svg className="derivar-modal__info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>El trámite será derivado a la unidad seleccionada para su revisión.</span>
        </div>

        <Input
          label="Unidad de Destino"
          placeholder="Seleccionar unidad organizacional"
          isRequired
          value={destinoUnidadId}
          onChange={(e) => setDestinoUnidadId((e.target as HTMLInputElement).value)}
        />

        <Input
          isTextarea
          label="Observaciones"
          placeholder="Motivo de la derivación (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones((e.target as HTMLTextAreaElement).value)}
        />

        {error && (
          <div className="derivar-modal__error" role="alert">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}
