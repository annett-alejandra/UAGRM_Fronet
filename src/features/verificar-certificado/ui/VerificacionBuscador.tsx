// src/features/verificar-certificado/ui/VerificacionBuscador.tsx
import { useState } from "react";
import { Search, QrCode } from "lucide-react";
import { Button } from "@shared/ui/Button";

type Props = {
  initialToken?: string;
  onVerificar: (token: string) => void;
  loading?: boolean;
};

export function VerificacionBuscador({ initialToken = "", onVerificar, loading }: Props) {
  const [token, setToken] = useState(initialToken);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onVerificar(token.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div className="relative flex items-center">
        <QrCode className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingrese el token único o código de verificación..."
          className="w-full pl-10 pr-24 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm"
        />
        <Button
          type="submit"
          disabled={!token.trim() || loading}
          className="absolute right-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs px-4 py-2 rounded-lg gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Verificar</span>
        </Button>
      </div>
    </form>
  );
}
