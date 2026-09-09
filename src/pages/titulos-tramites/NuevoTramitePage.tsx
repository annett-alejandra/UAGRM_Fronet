import { useNavigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { FormIniciarTramite } from '../../features/iniciar-tramite';
import { useToast } from '../../shared/ui/Toast/Toast';
import './NuevoTramitePage.css';

export function NuevoTramitePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Trámite creado',
      message: 'El trámite supletorio fue registrado exitosamente.',
    });
    navigate('/tramites');
  };

  return (
    <SidebarNavWidget pageTitle="Nuevo Trámite Supletorio">
      <div className="nuevo-tramite-page">
        <nav className="nuevo-tramite-page__breadcrumb">
          <a href="/tramites">Trámites</a>
          <span>›</span>
          <span>Nuevo Trámite</span>
        </nav>
        <FormIniciarTramite
          onSuccess={handleSuccess}
          onCancel={() => navigate('/tramites')}
        />
      </div>
    </SidebarNavWidget>
  );
}
