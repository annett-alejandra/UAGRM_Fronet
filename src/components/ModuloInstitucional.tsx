import React from 'react';

export default function ModuloInstitucional() {
  return (
    <div style={styles.dashboardContainer}>
      
      {/* TARJETA 1: Panel de Control Oficial */}
      <div style={styles.googleCard}>
        <div style={styles.headerZone}>
          {/* Icono oficial con el fondo suave de Google */}
          <div style={styles.iconWrapper}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              admin_panel_settings
            </span>
          </div>
          <span style={styles.badge}>Seguro</span>
        </div>

        <h3 style={styles.googleTitle}>Portal de Transparencia</h3>
        <p style={styles.googleText}>
          Acceda a los estados financieros, decretos oficiales y auditorías validadas por el sistema central del Estado.
        </p>

        <div style={styles.actionArea}>
          <button style={styles.primaryButton}>
            Ingresar al sistema
            <span className="material-symbols-outlined" style={styles.buttonIcon}>arrow_forward</span>
          </button>
        </div>
      </div>

      {/* TARJETA 2: Base de Datos */}
      <div style={styles.googleCard}>
        <div style={styles.headerZone}>
          <div style={styles.iconWrapper}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              database
            </span>
          </div>
          <span style={{ ...styles.badge, backgroundColor: '#f1f3f4', color: '#5f6368' }}>V2.4</span>
        </div>

        <h3 style={styles.googleTitle}>Repositorio Digital</h3>
        <p style={styles.googleText}>
          Consulte y descargue documentación institucional histórica en formatos abiertos y accesibles para la ciudadanía.
        </p>

        <div style={styles.actionArea}>
          <button style={styles.secondaryButton}>Ver documentos</button>
        </div>
      </div>

    </div>
  );
}

// Estilos limpios estructurados con las variables globales
const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    display: 'flex',
    gap: '24px',
    padding: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  googleCard: {
    backgroundColor: 'var(--google-bg-clean)',
    border: '1px solid var(--google-border)',
    borderRadius: 'var(--google-radius-card)',
    padding: '24px',
    maxWidth: '340px',
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
  },
  headerZone: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--google-blue-surface)',
    color: 'var(--google-blue)',
    borderRadius: '12px', /* Bordes cuadrados suavizados de Google */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#e6f4ea', /* Verde suave de Google */
    color: '#137333',
    padding: '4px 12px',
    borderRadius: 'var(--google-radius-pill)',
  },
  googleTitle: {
    fontSize: '20px',
    fontWeight: 500, /* Google prefiere Medium (500) en títulos para verse formal pero amigable */
    color: 'var(--google-text-primary)',
    margin: '0 0 10px 0',
    letterSpacing: '-0.2px',
  },
  googleText: {
    fontSize: '14px',
    color: 'var(--google-text-secondary)',
    lineHeight: '1.5',
    margin: '0 0 24px 0',
    flexGrow: 1, /* Alinea los botones al fondo uniformemente */
  },
  actionArea: {
    display: 'flex',
    gap: '8px',
  },
  primaryButton: {
    backgroundColor: 'var(--google-blue)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 'var(--google-radius-pill)',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'var(--google-blue)',
    border: '1px solid var(--google-border)',
    borderRadius: 'var(--google-radius-pill)',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  buttonIcon: {
    fontSize: '16px',
  }
};
