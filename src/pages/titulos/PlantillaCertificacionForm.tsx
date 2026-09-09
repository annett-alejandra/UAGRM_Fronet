import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/Button/Button';
import './PlantillaCertificacionForm.css';

export function PlantillaCertificacionForm() {
  const navigate = useNavigate();
  
  // Estado mockeado como si viniera de ANZIO o PostgreSQL
  const [formData, setFormData] = useState({
    nombre: 'JUAN PÉREZ GARCÍA',
    ci: '1234567 SC',
    carrera: 'INGENIERÍA INFORMÁTICA',
    fechaEmision: '15 de Mayo de 2022',
    nroTitulo: '54321-22',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndPrint = () => {
    setIsSaving(true);
    
    // Simular llamada al backend GraphQL / guardar datos
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Simular apertura del PDF generado por WeasyPrint en el backend
      const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      window.open(mockPdfUrl, '_blank');
    }, 1500);
  };

  return (
    <div className="plantilla-container">
      {/* Hoja A4 */}
      <div className="plantilla-a4">
        <div className="plantilla-header">
          <div className="plantilla-logo-placeholder">UAGRM</div>
          <div className="plantilla-title">Departamento de Títulos y Grados</div>
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>Certificación de Autenticidad</p>
        </div>

        <div className="plantilla-body">
          <p>
            A quien corresponda, el Jefe del Departamento de Títulos de la Universidad Autónoma Gabriel René Moreno, 
            certifica por el presente documento:
          </p>
          <br />
          <p>
            Que el(la) Sr/a: 
            <input 
              type="text" 
              className="plantilla-input" 
              style={{ width: '300px' }}
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              disabled={isSaving || isSaved}
            /> 
            con Carnet de Identidad Nro. 
            <input 
              type="text" 
              className="plantilla-input" 
              style={{ width: '150px' }}
              value={formData.ci}
              onChange={(e) => handleInputChange('ci', e.target.value)}
              disabled={isSaving || isSaved}
            />, 
            cursó y culminó satisfactoriamente los estudios correspondientes a la carrera de 
            <input 
              type="text" 
              className="plantilla-input" 
              style={{ width: '280px' }}
              value={formData.carrera}
              onChange={(e) => handleInputChange('carrera', e.target.value)}
              disabled={isSaving || isSaved}
            />,
            obteniendo el Título en Provisión Nacional Nro.
            <input 
              type="text" 
              className="plantilla-input" 
              style={{ width: '150px' }}
              value={formData.nroTitulo}
              onChange={(e) => handleInputChange('nroTitulo', e.target.value)}
              disabled={isSaving || isSaved}
            />,
            el cual fue emitido en fecha 
            <input 
              type="text" 
              className="plantilla-input" 
              style={{ width: '200px' }}
              value={formData.fechaEmision}
              onChange={(e) => handleInputChange('fechaEmision', e.target.value)}
              disabled={isSaving || isSaved}
            />.
          </p>
          <br />
          <p>
            Es cuanto se certifica para los fines consiguientes que convengan al interesado. 
            Dado en la ciudad de Santa Cruz de la Sierra, a los {new Date().getDate()} días del mes de {new Date().toLocaleString('es-ES', { month: 'long' })} de {new Date().getFullYear()}.
          </p>
        </div>

        <div className="plantilla-footer">
          <div className="plantilla-firma">
            <strong>Sello y Firma</strong><br />
            Operador de Títulos
          </div>
          <div className="plantilla-firma">
            <strong>Vo. Bo.</strong><br />
            Jefatura de Títulos y Grados
          </div>
        </div>
      </div>

      {/* Action Bar (Sticky Footer) */}
      <div className="plantilla-action-bar">
        <div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {isSaved ? 'Documento guardado y generado correctamente.' : 'Revise la plantilla y edite los campos necesarios antes de imprimir.'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/titulos/certificaciones')}
            disabled={isSaving}
          >
            {isSaved ? 'Volver al Buscador' : 'Cancelar / Rechazar'}
          </Button>
          {!isSaved && (
            <Button 
              variant="primary" 
              isLoading={isSaving}
              onClick={handleSaveAndPrint}
              style={{ background: 'var(--color-success-600)', borderColor: 'var(--color-success-600)' }}
            >
              Guardar e Imprimir Informe
            </Button>
          )}
          {isSaved && (
            <Button 
              variant="primary" 
              onClick={handleSaveAndPrint}
            >
              Reimprimir PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
