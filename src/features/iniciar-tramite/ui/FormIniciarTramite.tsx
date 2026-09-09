import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { TipoTitulo } from '../../../entities/tramite';
import { useIniciarTramite } from '../api/useIniciarTramite';
import './FormIniciarTramite.css';

const tramiteSchema = z.object({
  tipoTitulo: z.nativeEnum(TipoTitulo, { required_error: 'Selecciona un tipo de título' }),
  solicitanteNombre: z.string().min(3, 'Nombre mínimo 3 caracteres').max(200),
  solicitanteCi: z.string().min(5, 'CI inválido').max(20),
  carrera: z.string().min(3, 'Carrera requerida').max(200),
  facultad: z.string().min(3, 'Facultad requerida').max(200),
  observaciones: z.string().max(1000).optional(),
});

type TramiteFormData = z.infer<typeof tramiteSchema>;

interface FormIniciarTramiteProps {
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

const TIPO_OPTIONS: readonly { value: TipoTitulo; label: string }[] = [
  { value: TipoTitulo.ACADEMICO, label: 'Académico' },
  { value: TipoTitulo.PROVISION_NACIONAL, label: 'Provisión Nacional' },
  { value: TipoTitulo.SUPLETORIO, label: 'Supletorio' },
  { value: TipoTitulo.DUPLICADO, label: 'Duplicado' },
  { value: TipoTitulo.POSTGRADO, label: 'Postgrado' },
];

export function FormIniciarTramite({ onSuccess, onCancel }: FormIniciarTramiteProps) {
  const { isSubmitting, error, iniciarTramite } = useIniciarTramite();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TramiteFormData>({
    resolver: zodResolver(tramiteSchema),
    defaultValues: {
      tipoTitulo: undefined,
      solicitanteNombre: '',
      solicitanteCi: '',
      carrera: '',
      facultad: '',
      observaciones: '',
    },
  });

  const selectedTipo = watch('tipoTitulo');

  const onSubmit = async (data: TramiteFormData) => {
    const result = await iniciarTramite({
      ...data,
      documentoIds: [],
    });
    if (result) {
      onSuccess?.();
    }
  };

  return (
    <form className="form-iniciar-tramite" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Section: Tipo de Título */}
      <div className="form-iniciar-tramite__section">
        <h3 className="form-iniciar-tramite__section-title">Tipo de Título</h3>
        <div className="form-iniciar-tramite__tipo-grid">
          {TIPO_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`form-iniciar-tramite__tipo-option ${selectedTipo === option.value ? 'form-iniciar-tramite__tipo-option--selected' : ''}`}
            >
              <input
                type="radio"
                className="form-iniciar-tramite__tipo-radio"
                value={option.value}
                checked={selectedTipo === option.value}
                onChange={() => setValue('tipoTitulo', option.value, { shouldValidate: true })}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.tipoTitulo && (
          <span className="input-error-message" role="alert">{errors.tipoTitulo.message}</span>
        )}
      </div>

      {/* Section: Datos del Solicitante */}
      <div className="form-iniciar-tramite__section">
        <h3 className="form-iniciar-tramite__section-title">Datos del Solicitante</h3>
        <div className="form-iniciar-tramite__row">
          <Input
            label="Nombre Completo"
            isRequired
            errorMessage={errors.solicitanteNombre?.message}
            {...register('solicitanteNombre')}
          />
          <Input
            label="Cédula de Identidad"
            isRequired
            errorMessage={errors.solicitanteCi?.message}
            {...register('solicitanteCi')}
          />
        </div>
      </div>

      {/* Section: Información Académica */}
      <div className="form-iniciar-tramite__section">
        <h3 className="form-iniciar-tramite__section-title">Información Académica</h3>
        <div className="form-iniciar-tramite__row">
          <Input
            label="Carrera"
            isRequired
            errorMessage={errors.carrera?.message}
            {...register('carrera')}
          />
          <Input
            label="Facultad"
            isRequired
            errorMessage={errors.facultad?.message}
            {...register('facultad')}
          />
        </div>
      </div>

      {/* Section: Observaciones */}
      <div className="form-iniciar-tramite__section">
        <h3 className="form-iniciar-tramite__section-title">Observaciones</h3>
        <Input
          isTextarea
          label="Observaciones adicionales"
          helperText="Máximo 1000 caracteres"
          errorMessage={errors.observaciones?.message}
          {...register('observaciones')}
        />
      </div>

      {error && (
        <div className="form-iniciar-tramite__error" role="alert">
          {error}
        </div>
      )}

      <div className="form-iniciar-tramite__actions">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Iniciar Trámite
        </Button>
      </div>
    </form>
  );
}
