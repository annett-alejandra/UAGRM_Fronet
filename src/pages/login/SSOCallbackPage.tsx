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
    // El IdP puede devolver `ticket` o `code` dependiendo de la implementación.
    const token = searchParams.get('ticket') || searchParams.get('code');

    if (!token) {
      setError('No se recibió un ticket de autorización del Admin Central.');
      return;
    }

    const authenticate = async () => {
      try {
        // 1. Canjear el ticket. El backend establecerá las cookies HttpOnly.
        const { data: ssoResponse } = await restClient.post<{ ok: boolean }>('/sso/callback', { ticket: token });
        
        if (!ssoResponse.ok) {
          throw new Error('Error al canjear ticket.');
        }

        // 2. Obtener el perfil del usuario utilizando las cookies establecidas.
        const { data: userData } = await restClient.get<Usuario>('/v1/auth/me/');
        
        // 3. Guardar en el store y redirigir
        login(userData);
        navigate('/tramites', { replace: true });

      } catch (err) {
        console.error('Error en SSO Callback:', err);
        setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    };

    authenticate();
  }, [searchParams, login, navigate]);

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div className="login-card__brand">
          <div className="login-card__logo" aria-hidden="true">TS</div>
          <h1 className="login-card__title">Autenticando...</h1>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {error ? (
            <div className="login-card__error" role="alert">
              {error}
              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => navigate('/login')} 
                  style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#64748b' }}>
              <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <p>Conectando de forma segura con UAGRM...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
