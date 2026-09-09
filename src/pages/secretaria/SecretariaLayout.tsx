import { Routes, Route, Navigate } from 'react-router-dom';

export function SecretariaLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Placeholder */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>Secretaría General</h2>
        <nav>
          <ul>
            <li>Bandeja de Entrada</li>
            <li>Emisión de Títulos</li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<h1>Bienvenido a Secretaría General</h1>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
