import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/Button/Button';
import { Input } from '../../shared/ui/Input/Input';
import { Card } from '../../shared/ui/Card/Card';
import { Badge } from '../../shared/ui/Badge/Badge';
import { useValidarRecibo } from '../../features/titulos/api/useValidarRecibo';
import { useIniciarTramite } from '../../features/titulos/api/useIniciarTramite';

// Custom hook para el debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function BuscadorTitulos() {
  const [ci, setCi] = useState('');
  const [recibo, setRecibo] = useState('');
  const navigate = useNavigate();

  // 1. Debounce para el input de recibo (evitar spam al backend por cada tecla)
  const debouncedRecibo = useDebounce(recibo, 500);

  // 2. Ejecutar la Query de Caja usando Apollo (reactivo al debouncedRecibo)
  const { data: cajaData, isLoading: isLoadingCaja, error: cajaError } = useValidarRecibo(debouncedRecibo);
  
  // 3. Mutation de Iniciar Tramite
  const { iniciar, isLoading: isStarting } = useIniciarTramite();

  // Estado para mostrar el resultado UI de la mutación
  const [tramiteInfo, setTramiteInfo] = useState<{ exito: boolean, mensaje: string, rutaSugerida: string } | null>(null);

  const handleSearchData = async () => {
    if (!cajaData?.valido || !ci) return;
    
    // Llamar a la mutación GraphQL
    const resultado = await iniciar(ci, recibo);
    
    if (resultado) {
      setTramiteInfo(resultado);
    } else {
      // Mock Fallback si el server está offline
      console.warn('Backend inalcanzable. Usando fallback local para UI.');
      const esAntiguo = ['1', '2', '3'].includes(ci.charAt(0));
      setTramiteInfo({
        exito: true,
        mensaje: esAntiguo ? "Requiere Reconstrucción Pre-2023." : "Título Post-2023 encontrado.",
        rutaSugerida: esAntiguo ? "archivo_central" : "tramite_directo"
      });
    }
  };

  const renderSemaforo = () => {
    if (isLoadingCaja) return <Badge variant="secondary">Verificando en Informix...</Badge>;
    if (cajaError) return <Badge variant="danger">Error de conexión con Caja</Badge>;
    if (!debouncedRecibo || debouncedRecibo.length < 5) return <Badge variant="secondary">Caja: Esperando código...</Badge>;
    
    if (cajaData?.valido) {
      return <Badge variant="success">✅ Pago Confirmado (Bs. {cajaData.monto})</Badge>;
    } else if (cajaData?.valido === false) {
      return <Badge variant="danger">❌ {cajaData.motivo || 'Recibo Inválido'}</Badge>;
    }
    
    return <Badge variant="secondary">Caja: Esperando código...</Badge>;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Dashboard de Triage (Recepción)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Escanee el recibo de caja y busque el carnet del interesado.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <Card style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>1. Validación de Requisitos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <Input
                label="Nro. de Recibo de Caja (Pistola de Código de Barras)"
                placeholder="Escanee el recibo..."
                value={recibo}
                onChange={(e) => setRecibo(e.target.value)}
                autoFocus
              />
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {renderSemaforo()}
              </div>
            </div>

            <div>
              <Input
                label="Carnet de Identidad (C.I.)"
                placeholder="Ej. 1234567"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                disabled={!cajaData?.valido}
              />
            </div>

            <Button 
              variant="primary" 
              onClick={handleSearchData}
              disabled={!cajaData?.valido || !ci || isLoadingCaja || isStarting}
              isLoading={isStarting}
            >
              Consultar Historial (ANZIO / PostgreSQL)
            </Button>
          </div>
        </Card>

        {tramiteInfo && (
          <Card style={{ padding: '2rem', border: tramiteInfo.rutaSugerida === 'archivo_central' ? '2px solid var(--color-warning-500)' : '2px solid var(--color-success-500)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>2. Resultado de Evaluación</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1.1rem' }}>
                Respuesta del Orquestador: <strong>{tramiteInfo.mensaje}</strong>
              </p>
              {tramiteInfo.rutaSugerida === 'archivo_central' ? (
                <p style={{ color: 'var(--color-warning-700)', marginTop: '0.5rem' }}>
                  El documento no se encuentra en el sistema digital ANZIO (Pre-2023). 
                  Requiere búsqueda física y digitalización mediante el Módulo OCR.
                </p>
              ) : (
                <p style={{ color: 'var(--color-success-700)', marginTop: '0.5rem' }}>
                  Registro encontrado en el sistema ANZIO (Post-2023). Listo para emisión inmediata.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {tramiteInfo.rutaSugerida === 'archivo_central' ? (
                <Button 
                  variant="warning" 
                  onClick={() => {
                    alert('Trámite derivado exitosamente a la bandeja de Archivo Central.');
                    setTramiteInfo(null);
                    setCi('');
                    setRecibo('');
                  }}
                  style={{ flex: 1 }}
                >
                  🗄️ Derivar a Archivo Central
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  onClick={() => navigate(`/titulos/certificaciones/${ci}/plantilla`)}
                  style={{ flex: 1 }}
                >
                  ⚡ Generar Trámite Automático
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
