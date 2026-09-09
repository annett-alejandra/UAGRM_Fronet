import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { Badge } from '../../shared/ui/Badge/Badge';
import { Button } from '../../shared/ui/Button/Button';
import { Spinner } from '../../shared/ui/Spinner/Spinner';
import { Card, CardBody } from '../../shared/ui/Card/Card';
import { DerivarModal } from '../../features/derivar-tramite';
import { restClient } from '../../shared/api/rest-client';
import { type TramiteEntity, TramiteEstado, TipoTitulo } from '../../entities/tramite';
import { getEstadoBadge, getTipoLabel } from '../../entities/tramite/ui/TramiteRow';
import { formatDateTime } from '../../shared/lib/format';
import './DetalleTramitePage.css';

export function DetalleTramitePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tramite, setTramite] = useState<TramiteEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDerivar, setShowDerivar] = useState(false);
  const [showCertificadoOpciones, setShowCertificadoOpciones] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTramite = async () => {
      try {
        const { data } = await restClient.get<TramiteEntity>('/tramites/tramites/' + id + '/');
        setTramite(data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    void fetchTramite();
  }, [id]);

  const handlePrintPdf = () => {
    // LLamar al servicio PDF Generator del backend
    console.log('Generando PDF del expediente...');
  };

  const handleGenerarCertificado = (size: string) => {
    console.log(Generando Certificado en tamao \);
    setShowCertificadoOpciones(false);
  };

  if (isLoading) {
    return (
      <SidebarNavWidget pageTitle="Detalle del Trmite">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size="lg" />
        </div>
      </SidebarNavWidget>
    );
  }

  if (!tramite) {
    return (
      <SidebarNavWidget pageTitle="Detalle del Trmite">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)' }}>
          Trmite no encontrado.
        </div>
      </SidebarNavWidget>
    );
  }

  const badge = getEstadoBadge(tramite.estado);

  return (
    <SidebarNavWidget pageTitle="Detalle del Trmite">
      <div className="detalle-tramite-page">
        <nav className="detalle-tramite-page__breadcrumb">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>? Volver Atrs</Button>
        </nav>

        <div className="detalle-tramite-page__header">
          <div className="detalle-tramite-page__header-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="detalle-tramite-page__codigo">{tramite.codigo}</span>
              <Badge variant={badge.variant} showDot size="lg">{badge.label}</Badge>
            </div>
            <span className="detalle-tramite-page__solicitante">
              {tramite.solicitanteNombre}  CI: {tramite.solicitanteCi}
            </span>
          </div>
          <div className="detalle-tramite-page__actions">
            <Button variant="secondary" onClick={handlePrintPdf}>??? Imprimir PDF</Button>
            
            <div style={{ position: 'relative' }}>
              <Button variant="primary" onClick={() => setShowCertificadoOpciones(!showCertificadoOpciones)}>
                ?? Certificado de Autenticidad
              </Button>
              {showCertificadoOpciones && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', zIndex: 10, boxShadow: 'var(--shadow-md)', minWidth: '150px' }}>
                  <Button variant="ghost" isFullWidth onClick={() => handleGenerarCertificado('A4')}>Tamao A4</Button>
                  <Button variant="ghost" isFullWidth onClick={() => handleGenerarCertificado('CARTA')}>Tamao Carta</Button>
                  <Button variant="ghost" isFullWidth onClick={() => handleGenerarCertificado('OFICIO')}>Tamao Oficio</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detalle-tramite-page__grid">
          <Card>
            <CardBody>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Datos del Expediente</h3>
              <div className="detalle-tramite-page__field">
                <span className="detalle-tramite-page__field-label">Tipo de Ttulo</span>
                <span className="detalle-tramite-page__field-value">{getTipoLabel(tramite.tipoTitulo)}</span>
              </div>
              <div className="detalle-tramite-page__field">
                <span className="detalle-tramite-page__field-label">Unidad Actual</span>
                <span className="detalle-tramite-page__field-value">{tramite.unidadActual}</span>
              </div>
              <div className="detalle-tramite-page__field">
                <span className="detalle-tramite-page__field-label">Fecha</span>
                <span className="detalle-tramite-page__field-value">{formatDateTime(tramite.createdAt)}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Historial de Validaciones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                  <div>
                    <strong>Validacin OCR</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Revisado automticamente por el motor.</p>
                  </div>
                  <Badge variant="success">Completado</Badge>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--warning)' }}>
                  <div>
                    <strong>Validacin de Requisitos</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Revisin manual por analista.</p>
                  </div>
                  <Badge variant="warning">Pendiente</Badge>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <Button variant="primary" isFullWidth onClick={() => setShowDerivar(true)}>
                  Validar y Derivar Expediente
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <DerivarModal
          isOpen={showDerivar}
          onClose={() => setShowDerivar(false)}
          tramiteId={tramite.id}
          tramiteCodigo={tramite.codigo}
          onSuccess={() => {}}
        />
      </div>
    </SidebarNavWidget>
  );
}
