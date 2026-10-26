import {
  useState,
} from "react";

import {
  Badge,
  Button,
  CountdownTimer,
  Input,
  Modal,
} from "@/shared/ui";

import {
  DobleAutenticacionService,
} from "../classes/DobleAutenticacionService";

const dobleAutenticacionService =
  new DobleAutenticacionService();

interface DobleAutenticacionModalProps {
  readonly isOpen: boolean;

  readonly onClose:
    () => void;

  readonly onConfirm:
    (codigo: string) => void;

  readonly expiresAt: number;

  readonly isLoading?: boolean;

  readonly error?: string | null;
}

function DobleAutenticacionModal({
  isOpen,
  onClose,
  onConfirm,
  expiresAt,
  isLoading = false,
  error = null,
}: DobleAutenticacionModalProps) {
  const [codigo, setCodigo] =
    useState("");

  const [expirado, setExpirado] =
    useState(false);

  const codigoValido =
    dobleAutenticacionService.validarCodigo(
      codigo
    );

  function confirmar() {
    if (
      !codigoValido ||
      expirado
    ) {
      return;
    }

    onConfirm(
      codigo.trim()
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verificación de seguridad"
      size="sm"
      closeOnOverlayClick={
        !isLoading
      }
      closeOnEsc={
        !isLoading
      }
      footer={
        <div
          className="
            flex
            w-full
            justify-end
            gap-2
          "
        >
          <Button
            type="button"
            variant="outline"
            disabled={
              isLoading
            }
            onClick={
              onClose
            }
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            isLoading={
              isLoading
            }
            disabled={
              !codigoValido ||
              expirado
            }
            onClick={
              confirmar
            }
          >
            Verificar y continuar
          </Button>
        </div>
      }
    >
      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        <div>
          <Badge
            variant={
              expirado
                ? "danger"
                : "warning"
            }
          >
            {expirado
              ? "Autorización expirada"
              : "Doble autenticación"}
          </Badge>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-foreground
              opacity-70
            "
          >
            Ingrese el código de
            seguridad para habilitar
            temporalmente la firma.
            La autorización tendrá una
            duración máxima de cinco
            minutos.
          </p>
        </div>

        {!expirado && (
          <CountdownTimer
            expiresAt={
              expiresAt
            }
            onExpire={() =>
              setExpirado(true)
            }
          />
        )}

        <div>
          <label
            htmlFor="codigo2fa"
            className="
              mb-2
              block
              text-sm
              font-medium
            "
          >
            Código de seguridad
          </label>

          <Input
            id="codigo2fa"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={codigo}
            hasError={
              codigo.length >
                0 &&
              !codigoValido
            }
            disabled={
              expirado ||
              isLoading
            }
            onChange={(event) =>
              setCodigo(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
          />

          {codigo.length > 0 &&
            !codigoValido && (
              <p
                className="
                  mt-2
                  text-xs
                  text-destructive
                "
              >
                El código debe
                contener 6 dígitos.
              </p>
            )}
        </div>

        {error && (
          <div
            className="
              rounded-base
              border
              border-destructive
              p-3
            "
          >
            <p
              className="
                text-sm
                text-destructive
              "
            >
              {error}
            </p>
          </div>
        )}

        {expirado && (
          <p
            className="
              text-sm
              font-medium
              text-destructive
            "
          >
            La ventana temporal de
            autorización ha expirado.
            Cierre esta ventana y
            solicite una nueva
            autorización.
          </p>
        )}
      </div>
    </Modal>
  );
}

export default DobleAutenticacionModal;