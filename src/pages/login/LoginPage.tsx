import { Button } from '../../shared/ui/Button/Button';
import './LoginPage.css';

export function LoginPage() {
  const handleLogin = () => {
    // Redirigir al IdP Admin Central UAGRM
    const clientId = 'titulo_supletorio_app';
    const redirectUri = encodeURIComponent('http://localhost:3000/sso/callback');
    window.location.href = `https://admincentral.uagrm.edu.bo/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '400px' }}>
        <div className="login-card__brand">
          <div className="login-card__logo" aria-hidden="true">TS</div>
          <h1 className="login-card__title">Títulos y Trámites</h1>
          <p className="login-card__subtitle">Sistema de Gestión Documental — UAGRM</p>
        </div>

        <div className="login-card__form" style={{ marginTop: '2rem' }}>
          <Button 
            onClick={handleLogin}
            variant="primary" 
            isFullWidth 
            style={{ padding: '1rem', fontSize: '1rem' }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ marginRight: '8px', display: 'inline-block' }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Iniciar Sesión con Admin Central
          </Button>
        </div>

        <div className="login-card__footer" style={{ marginTop: '2rem' }}>
          © {new Date().getFullYear()} DTIC — Universidad Autónoma Gabriel René Moreno
        </div>
      </div>
    </div>
  );
}
