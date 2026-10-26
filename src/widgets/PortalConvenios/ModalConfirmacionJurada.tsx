import * as React from "react";
import { Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button, Modal, Checkbox } from "@shared/ui";
import {
  type RolTramite,
  type SolicitudPersonalData,
  type SolicitudInstitucionalData,
  type PostulanteNomina,
} from "./portal.types";

export interface ModalConfirmacionJuradaProps {
  rol: RolTramite;
  personalData: SolicitudPersonalData;
  institucionalData: SolicitudInstitucionalData;
  postulantes: PostulanteNomina[];
  disabled: boolean;
  onRadicar: () => void;
}

/**
 * Barra de Radicación Principal y Modal de Confirmación Jurada
 * Exige consentimiento y confirmación de veracidad legal antes del despacho.
 * Consume Modal, Checkbox y Button de @shared/ui, sin estilos en línea.
 */
export const ModalConfirmacionJurada: React.FC<ModalConfirmacionJuradaProps> = ({
  rol,
  personalData,
  institucionalData,
  postulantes,
  disabled,
  onRadicar,
}) => {
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [juramentoAceptado, setJuramentoAceptado] = React.useState(false);

  const handleConfirmar = () => {
    if (!juramentoAceptado) return;
    setModalAbierto(false);
    setJuramentoAceptado(false);
    onRadicar();
  };

  const nombreSolicitante =
    rol === "personal"
      ? personalData.nombreCompleto || "Solicitante Particular"
      : institucionalData.razonSocial || "Entidad Institucional";

  const documentoAdjunto =
    rol === "personal"
      ? personalData.cartaPdf?.name || "Carta de solicitud digitalizada"
      : institucionalData.oficioPdf?.name || "Oficio institucional digitalizado";

  return (
    <>
      {/* Barra de Acciones y Envío */}
      <footer className="portal-actions-bar">
        <div className="portal-actions-legal">
          <ShieldCheck size={20} className="text-uagrm-blue" aria-hidden="true" />
          <span>
            Trámite oficial amparado bajo normativa universitaria y fe pública de la UAGRM.
          </span>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={disabled}
          onClick={() => setModalAbierto(true)}
        >
          <Send size={18} />
          <span>Radicar Solicitud Oficial</span>
        </Button>
      </footer>

      {/* Modal Institucional de Confirmación Jurada */}
      <Modal
        open={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setJuramentoAceptado(false);
        }}
        title="Declaración Jurada y Radicación Oficial"
        description="Por favor, verifique el resumen de su solicitud antes de enviar el trámite a Secretaría General."
      >
        <div className="portal-modal-body">
          {/* Advertencia Legal */}
          <div className="portal-modal-alert">
            Declaro bajo fe de juramento que la información suministrada y los documentos
            digitalizados adjuntos son auténticos, válidos y corresponden fielmente a los
            antecedentes académicos o institucionales registrados en la UAGRM.
          </div>

          {/* Resumen del Trámite */}
          <div className="portal-modal-summary">
            <div className="portal-modal-row">
              <span>Modalidad:</span>
              <strong>
                {rol === "personal"
                  ? "Trámite Personal (Graduado)"
                  : "Solicitud Institucional (Convenio)"}
              </strong>
            </div>

            <div className="portal-modal-row">
              <span>Solicitante / Entidad:</span>
              <strong>{nombreSolicitante}</strong>
            </div>

            <div className="portal-modal-row">
              <span>Documento de respaldo:</span>
              <span>{documentoAdjunto}</span>
            </div>

            {rol === "institucional" && (
              <div className="portal-modal-row">
                <span>Nómina para verificación:</span>
                <strong>{postulantes.length} postulante(s)</strong>
              </div>
            )}
          </div>

          {/* Checkbox de Consentimiento Jurado */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="consentimiento-jurada"
              checked={juramentoAceptado}
              onCheckedChange={(checked) => setJuramentoAceptado(Boolean(checked))}
            />
            <label
              htmlFor="consentimiento-jurada"
              className="text-sm font-medium text-slate-700 leading-snug cursor-pointer select-none"
            >
              Certifico la autenticidad de la documentación y acepto la fiscalización y
              cotejo documental en Secretaría General y Despacho Legal.
            </label>
          </div>

          {/* Botones de Acción del Modal */}
          <div className="portal-modal-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setModalAbierto(false);
                setJuramentoAceptado(false);
              }}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="primary"
              disabled={!juramentoAceptado}
              onClick={handleConfirmar}
            >
              <CheckCircle2 size={16} />
              <span>Confirmar y Radicar</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmacionJurada;
