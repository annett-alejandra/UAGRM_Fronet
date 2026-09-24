import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { restClient } from '../../shared/api/rest-client';
import { useAuthStore, type Usuario } from '../../shared/lib/auth';
import './LoginPage.css';

export function SSOCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('ticket') || searchParams.get('code');

    if (!token) {
      setError('No se recibió un ticket de autorización del SSO UAGRM.');
      return;
    }

    const authenticate = async () => {
      try {
        // 1. Canjear el ticket en el backend
        await restClient.post<{ ok: boolean; status?: string }>('/auth/sso/callback/', { ticket: token });
        
        // 2. Obtener el perfil del usuario utilizando la sesión activa
        const { data: userData } = await restClient.get<any>('/auth/me/');
        
        // 3. Mapear datos y guardar en store de autenticación
        login({
          id: String(userData.id || '1'),
          nombre_completo: userData.nombre || userData.nombre_completo || 'Usuario Autenticado',
          email: userData.email || '',
          roles: userData.rol ? [userData.rol] : ['ARCHIVO_CENTRAL'],
          permisos: userData.permisos || ['ALL'],
        });

        navigate('/archivo', { replace: true });

      } catch (err) {
        console.error('Error en SSO Callback:', err);
        setError('Error al conectar con el SSO UAGRM. Asegúrate de tener el Backend activo en localhost:8000.');
      }
    };

    authenticate();
  }, [searchParams, login, navigate]);

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div className="login-card__brand">
          <div className="login-card__logo" aria-hidden="true">UAGRM</div>
          <h1 className="login-card__title">Autenticando con SSO UAGRM...</h1>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {error ? (
            <div className="login-card__error" role="alert">
              {error}
              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => navigate('/login')} 
                  style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#64748b' }}>
              <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <p>Verificando credenciales con la Universidad Autónoma Gabriel René Moreno...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
