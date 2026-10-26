import React, { createContext, useState } from "react";
import initialData from "../mock/mock_data.json";
import { USUARIO_SECRETARIA_GENERAL } from "../constants/uagrmData";
import { Button } from "@shared/ui";
import { X } from "lucide-react";
import type {
  SecretariaContextType,
  SolicitudAdmision,
  CertificacionApostilla,
  CartonDespacho,
  ConvenioInstitucional,
  AuditoriaDespacho,
  ToastItem,
  TipoToast,
} from "../types/secretaria.types";

const SecretariaContext = createContext<SecretariaContextType | null>(null);

interface SecretariaProviderProps {
  children: React.ReactNode;
}

export function SecretariaProvider({ children }: SecretariaProviderProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmision[]>(
    initialData.solicitudesAdmision as unknown as SolicitudAdmision[]
  );
  const [apostillas, setApostillas] = useState<CertificacionApostilla[]>(
    initialData.certificacionesApostilla as unknown as CertificacionApostilla[]
  );
  const [cartones, setCartones] = useState<CartonDespacho[]>(
    initialData.cartonesDespacho as unknown as CartonDespacho[]
  );
  const [convenios, setConvenios] = useState<ConvenioInstitucional[]>(
    initialData.conveniosInstitucionales as unknown as ConvenioInstitucional[]
  );
  const [auditorias, setAuditorias] = useState<AuditoriaDespacho[]>(
    initialData.auditoriasDespachoSeguro as unknown as AuditoriaDespacho[]
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (tipo: TipoToast, mensaje: string) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Aprobar y Habilitar Trámite
  const aprobarSolicitud = (id: string) => {
    setSolicitudes((prev) =>
      prev.map((sol) =>
        sol.id === id ? { ...sol, estado: "APROBADO" } : sol
      )
    );
    addToast(
      "success",
      `Solicitud ${id} aprobada con éxito. Se disparó la notificación y se habilitó la carga documental al solicitante.`
    );
  };

  // 2. Rechazar Solicitud con observación obligatoria
  const rechazarSolicitud = (id: string, observacion: string): boolean => {
    if (!observacion || !observacion.trim()) {
      addToast("error", "Error: La observación formal es obligatoria para rechazar la solicitud.");
      return false;
    }
    setSolicitudes((prev) =>
      prev.map((sol) =>
        sol.id === id
          ? { ...sol, estado: "RECHAZADO", observacion: observacion.trim() }
          : sol
      )
    );
    addToast(
      "destructive",
      `Solicitud ${id} rechazada formalmente. Observación registrada y notificada.`
    );
    return true;
  };

  // 3. Generar Certificación para Cancillería / Apostilla
  const generarCertificacionApostilla = (id: string, paisDestino: string, regimen: string) => {
    const fechaActual = new Date().toISOString().split("T")[0];
    setApostillas((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              estadoApostilla: "CERTIFICADO_GENERADO",
              paisDestino,
              regimen,
              fechaCertificacion: fechaActual,
            }
          : item
      )
    );
    addToast(
      "success",
      `Certificación internacional generada para ${paisDestino} bajo régimen "${regimen}".`
    );
  };

  // 4. Desbloqueo e Impresión con Auditoría Invisible
  const registrarDesbloqueoImpresion = (carton: CartonDespacho): AuditoriaDespacho => {
    const nuevoLog: AuditoriaDespacho = {
      id: `AUD-${Date.now()}`,
      fechaHora: new Date().toISOString(),
      ipTerminal: "192.168.1.105 (Detectada Terminal Despacho)",
      usuarioLogueado: USUARIO_SECRETARIA_GENERAL,
      documentoId: carton.id,
      seriePapel: carton.seriePapel,
      tipoCarton: carton.tipoCarton,
      graduado: carton.graduado,
    };

    setAuditorias((prev) => [nuevoLog, ...prev]);

    setCartones((prev) =>
      prev.map((c) =>
        c.id === carton.id ? { ...c, estado: "IMPRESO_SELLADO" } : c
      )
    );

    addToast(
      "success",
      `Protocolo verificado: Cartón ${carton.seriePapel} desbloqueado e impreso. Auditoría de custodia registrada.`
    );

    return nuevoLog;
  };

  // 5. Alta de Convenio
  const crearConvenio = (nuevoConvenio: Omit<ConvenioInstitucional, "id" | "estado">): ConvenioInstitucional => {
    const id = `CONV-${String(convenios.length + 1).padStart(3, "0")}`;
    const convenioCompleto: ConvenioInstitucional = {
      ...nuevoConvenio,
      id,
      estado: "VIGENTE",
    };
    setConvenios((prev) => [convenioCompleto, ...prev]);
    addToast(
      "success",
      `Convenio ${convenioCompleto.numeroConvenio} (${convenioCompleto.razonSocial}) registrado exitosamente.`
    );
    return convenioCompleto;
  };

  return (
    <SecretariaContext.Provider
      value={{
        solicitudes,
        apostillas,
        cartones,
        convenios,
        auditorias,
        aprobarSolicitud,
        rechazarSolicitud,
        generarCertificacionApostilla,
        registrarDesbloqueoImpresion,
        crearConvenio,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
      {/* Sistema de Toasts flotantes con clases semánticas oficiales */}
      <div className="sec-toast-container">
        {toasts.map((toast) => {
          let toastClass = "sec-toast sec-toast--info";
          if (toast.tipo === "success") toastClass = "sec-toast sec-toast--success";
          if (toast.tipo === "destructive" || toast.tipo === "error") toastClass = "sec-toast sec-toast--destructive";
          if (toast.tipo === "warning") toastClass = "sec-toast sec-toast--warning";

          return (
            <div key={toast.id} className={toastClass}>
              <span>{toast.mensaje}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sec-btn-compact-icon sec-toast-close"
                onClick={() => removeToast(toast.id)}
                title="Cerrar notificación"
              >
                <X size={14} />
              </Button>
            </div>
          );
        })}
      </div>
    </SecretariaContext.Provider>
  );
}

export { SecretariaContext };
