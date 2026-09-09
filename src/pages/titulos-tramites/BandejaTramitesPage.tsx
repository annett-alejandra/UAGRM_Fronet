import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { BandejaEntradaWidget } from '../../widgets/BandejaEntradaWidget';
import { restClient } from '../../shared/api/rest-client';
import type { TramiteEntity } from '../../entities/tramite';
import './BandejaTramitesPage.css';

export function BandejaTramitesPage() {
  const navigate = useNavigate();
  const [tramites, setTramites] = useState<readonly TramiteEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const { data } = await restClient.get<readonly TramiteEntity[]>('/tramites/tramites/');
        setTramites(data);
      } catch {
        /* Error handled silently, empty list shown */
      } finally {
        setIsLoading(false);
      }
    };
    void fetchTramites();
  }, []);

  return (
    <SidebarNavWidget pageTitle="Bandeja de Trámites">
      <div className="bandeja-tramites-page">
        <BandejaEntradaWidget
          tramites={tramites}
          isLoading={isLoading}
          onTramiteClick={(t) => navigate(`/tramites/${t.id}`)}
          onNuevoTramite={() => navigate('/tramites/nuevo')}
        />
      </div>
    </SidebarNavWidget>
  );
}
