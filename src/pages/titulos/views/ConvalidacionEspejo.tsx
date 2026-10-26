import {
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
} from "@/shared/ui";

import {
  BovedaService,
} from "../classes/BovedaService";

import {
  ConvalidacionService,
} from "../classes/ConvalidacionService";

import {
  DocumentoViewerService,
} from "../classes/DocumentoViewerService";

import {
  ExpedienteConvalidacionService,
} from "../classes/ExpedienteConvalidacionService";

import {
  documentosConvalidacionMock,
} from "../mock/convalidacion.mock";

import type {
  CampoConvalidacion,
} from "../types/titulos-gestion.types";

const convalidacionService =
  new ConvalidacionService();

const viewerService =
  new DocumentoViewerService();

const expedienteService =
  new ExpedienteConvalidacionService();

const bovedaService =
  new BovedaService();

function ConvalidacionEspejo() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  // ==========================================
  // EXPEDIENTE
  // ==========================================

  const expedienteId =
    searchParams.get("expediente") ??
    "EXP-001";

  const documento =
    expedienteService.obtenerPorExpediente(
      documentosConvalidacionMock,
      expedienteId
    );

  // ==========================================
  // ESTADOS
  // ==========================================

  const [campos, setCampos] =
    useState<CampoConvalidacion[]>(
      () =>
        documento?.campos ?? []
    );

  const [zoom, setZoom] =
    useState(0.8);

  const [rotacion, setRotacion] =
    useState(0);

  const [contraste, setContraste] =
    useState(false);

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  // ==========================================
  // CAMBIAR CAMPO
  // ==========================================

  function cambiarCampo(
    campoId: string,
    nuevoValor: string
  ) {
    setCampos((actuales) =>
      actuales.map((campo) =>
        campo.campo === campoId
          ? convalidacionService.actualizarCampo(
              campo,
              nuevoValor
            )
          : campo
      )
    );
  }

  // ==========================================
  // VISOR
  // ==========================================

  function aumentarZoom() {
    setZoom(
      viewerService.aumentarZoom(
        zoom
      )
    );
  }

  function disminuirZoom() {
    setZoom(
      viewerService.disminuirZoom(
        zoom
      )
    );
  }

  function rotarDerecha() {
    setRotacion(
      viewerService.rotarDerecha(
        rotacion
      )
    );
  }

  function rotarIzquierda() {
    setRotacion(
      viewerService.rotarIzquierda(
        rotacion
      )
    );
  }

  function alternarContraste() {
    setContraste(
      viewerService.alternarContraste(
        contraste
      )
    );
  }

  function restablecerVista() {
    const estado =
      viewerService.restablecerVista();

    setZoom(estado.zoom);
    setRotacion(
      estado.rotacion
    );
    setContraste(
      estado.contraste
    );
  }

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  function volverBandeja() {
    navigate(
      "/archivo/bandeja"
    );
  }

  // ==========================================
  // DERIVAR A BÓVEDA
  // ==========================================

  function derivarBoveda() {
    if (!documento) {
      return;
    }

    const ubicacion =
      window.prompt(
        "Ingrese número de estante/tomo:"
      );

    if (!ubicacion) {
      return;
    }

    const titular =
      campos.find(
        (campo) =>
          campo.campo ===
          "nombre"
      )?.valorFinal ??
      "Sin información";

    const ci =
      campos.find(
        (campo) =>
          campo.campo ===
          "ci"
      )?.valorFinal ??
      "Sin información";

    bovedaService.guardarRegistro({
      id: `BOV-${documento.expedienteId}`,

      expedienteId:
        documento.expedienteId,

      rut:
        documento.rut,

      ci,

      titular,

      tipoDocumento:
        documento.tipoDocumento,

      ubicacion,

      fechaDerivacion:
        new Date()
          .toISOString()
          .slice(0, 10),
    });

    setMensaje(
      `Documento ${documento.expedienteId} derivado correctamente a Bóveda Física: ${ubicacion}.`
    );
  }

  // ==========================================
  // CONVALIDAR
  // ==========================================

  function convalidarRegistro() {
    const dudosos =
      convalidacionService.contarDatosDudosos(
        campos
      );

    if (dudosos > 0) {
      const confirmar =
        window.confirm(
          `Existen ${dudosos} dato(s) que todavía difieren de la base institucional. ¿Desea continuar con la convalidación?`
        );

      if (!confirmar) {
        return;
      }
    }

    setMensaje(
      `El expediente ${expedienteId} fue convalidado y guardado correctamente.`
    );
  }

  // ==========================================
  // EXPEDIENTE NO ENCONTRADO
  // ==========================================

  if (!documento) {
    return (
      <main
        className="
          flex
          min-h-full
          items-center
          justify-center
          bg-background
          p-6
          text-foreground
        "
      >
        <Card
          className="
            w-full
            max-w-lg
          "
        >
          <CardContent
            className="
              flex
              flex-col
              items-center
              gap-4
              p-8
              text-center
            "
          >
            <Badge variant="warning">
              Archivo Central
            </Badge>

            <h1
              className="
                text-2xl
                font-bold
                text-primary
              "
            >
              Expediente no encontrado
            </h1>

            <p
              className="
                text-sm
                text-foreground
                opacity-60
              "
            >
              No existe información de
              convalidación para el
              expediente:
            </p>

            <strong>
              {expedienteId}
            </strong>

            <Button
              type="button"
              variant="primary"
              onClick={
                volverBandeja
              }
            >
              Volver a Bandeja de Entrada
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ==========================================
  // INFORMACIÓN DOCUMENTO
  // ==========================================

  const nombreTitular =
    expedienteService.obtenerCampo(
      documento,
      "nombre"
    );

  const ci =
    expedienteService.obtenerCampo(
      documento,
      "ci"
    );

  const fechaEmision =
    expedienteService.obtenerCampo(
      documento,
      "fecha_emision"
    );

  const numeroTitulo =
    expedienteService.obtenerCampo(
      documento,
      "numero_titulo"
    );

  const autoridad =
    expedienteService.obtenerCampo(
      documento,
      "autoridad"
    );

  const cantidadDudosos =
    convalidacionService.contarDatosDudosos(
      campos
    );

  const tituloDocumento =
    documento.tipoDocumento
      .replaceAll("_", " ");

  return (
    <main
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        bg-background
        text-foreground
      "
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header
        className="
          flex
          shrink-0
          flex-col
          justify-between
          gap-4
          border-b
          border-border
          bg-surface
          px-6
          py-5
          lg:flex-row
          lg:items-center
        "
      >
        <div>
          <Badge variant="neutral">
            Archivo Central
          </Badge>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-primary
            "
          >
            Estación de Convalidación
            Espejo
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-foreground
              opacity-60
            "
          >
            Compare el documento
            digitalizado con los datos
            extraídos y la base
            institucional.
          </p>

          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-x-4
              gap-y-1
              text-xs
              text-foreground
              opacity-70
            "
          >
            <span>
              Expediente:{" "}
              <strong>
                {
                  documento.expedienteId
                }
              </strong>
            </span>

            <span>
              RUT:{" "}
              <strong>
                {documento.rut}
              </strong>
            </span>
          </div>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <Badge
            variant={
              cantidadDudosos > 0
                ? "warning"
                : "success"
            }
          >
            {cantidadDudosos > 0
              ? `${cantidadDudosos} dato(s) dudoso(s)`
              : "Datos coincidentes"}
          </Badge>

          <Badge variant="neutral">
            {
              documento.tipoDocumento
            }
          </Badge>
        </div>
      </header>

      {/* ================================= */}
      {/* ESPEJO 50 / 50 */}
      {/* ================================= */}

      <section
        className="
          grid
          min-h-0
          flex-1
          grid-cols-1
          overflow-hidden
          lg:grid-cols-2
        "
      >

        {/* =============================== */}
        {/* VISOR */}
        {/* =============================== */}

        <section
          className="
            flex
            min-h-0
            min-w-0
            flex-col
            border-r
            border-border
          "
        >

          {/* TOOLBAR */}

          <div
            className="
              flex
              shrink-0
              flex-wrap
              items-center
              gap-2
              border-b
              border-border
              bg-surface
              p-3
            "
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={
                disminuirZoom
              }
              aria-label="Disminuir zoom"
            >
              −
            </Button>

            <Badge variant="neutral">
              {Math.round(
                zoom * 100
              )}
              %
            </Badge>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={
                aumentarZoom
              }
              aria-label="Aumentar zoom"
            >
              +
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={
                rotarIzquierda
              }
              aria-label="Rotar izquierda"
            >
              ↺
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={
                rotarDerecha
              }
              aria-label="Rotar derecha"
            >
              ↻
            </Button>

            <Button
              type="button"
              variant={
                contraste
                  ? "secondary"
                  : "outline"
              }
              size="sm"
              aria-pressed={
                contraste
              }
              onClick={
                alternarContraste
              }
            >
              Contraste
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={
                restablecerVista
              }
            >
              Restablecer
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={
                volverBandeja
              }
            >
              Volver
            </Button>
          </div>

          {/* DOCUMENTO */}

          <div
            className="
              flex
              min-h-0
              flex-1
              items-start
              justify-center
              overflow-auto
              bg-slate-700
              px-8
              pb-20
              pt-10
            "
          >
            <article
              className={`
                mx-auto
                w-[520px]
                min-h-[680px]
                shrink-0
                origin-top
                border
                border-border
                bg-white
                p-14
                text-center
                text-slate-900
                shadow-xl
                transition-[filter]
                ${
                  contraste
                    ? "contrast-200 grayscale"
                    : ""
                }
              `}
              style={{
                transform:
                  `scale(${zoom}) rotate(${rotacion}deg)`,
              }}
            >
              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-primary
                  font-bold
                  text-primary
                "
              >
                UAGRM
              </div>

              <h2
                className="
                  text-xl
                  font-bold
                  tracking-wide
                "
              >
                {tituloDocumento}
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Universidad Autónoma
                Gabriel René Moreno
              </p>

              <div
                className="
                  my-8
                  border-t
                  border-slate-300
                "
              />

              <p
                className="
                  text-sm
                  text-slate-600
                "
              >
                Se certifica que
              </p>

              <h3
                className="
                  my-5
                  text-xl
                  font-bold
                  uppercase
                "
              >
                {nombreTitular}
              </h3>

              <p
                className="
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                ha cumplido con los
                requisitos académicos
                correspondientes.
              </p>

              <div
                className="
                  my-8
                  space-y-3
                  rounded-base
                  border
                  border-slate-200
                  p-5
                  text-left
                  text-sm
                "
              >
                <p>
                  <strong>
                    C.I.:
                  </strong>{" "}
                  {ci}
                </p>

                <p>
                  <strong>
                    Fecha de emisión:
                  </strong>{" "}
                  {fechaEmision}
                </p>

                <p>
                  <strong>
                    N.º Título / Acta:
                  </strong>{" "}
                  {numeroTitulo}
                </p>

                <p>
                  <strong>
                    Autoridad:
                  </strong>{" "}
                  {autoridad}
                </p>
              </div>

              <div
                className="
                  mt-16
                  grid
                  grid-cols-2
                  gap-8
                  text-xs
                "
              >
                <div>
                  <div
                    className="
                      mb-2
                      border-t
                      border-slate-600
                    "
                  />

                  Rector
                </div>

                <div>
                  <div
                    className="
                      mb-2
                      border-t
                      border-slate-600
                    "
                  />

                  Secretario General
                </div>
              </div>
            </article>
          </div>

        </section>

        {/* =============================== */}
        {/* VALIDACIÓN */}
        {/* =============================== */}

        <section
          className="
            min-h-0
            min-w-0
            overflow-y-auto
            bg-background
            p-5
            lg:p-6
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-3xl
              flex-col
              gap-5
            "
          >

            {/* RESUMEN */}

            <Card>
              <CardContent
                className="
                  flex
                  flex-col
                  gap-3
                  p-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <span
                    className="
                      text-xs
                      text-foreground
                      opacity-60
                    "
                  >
                    Documento detectado
                  </span>

                  <strong
                    className="
                      mt-1
                      block
                      text-sm
                    "
                  >
                    {
                      documento.tipoDocumento
                    }
                  </strong>
                </div>

                <Badge
                  variant={
                    cantidadDudosos > 0
                      ? "warning"
                      : "success"
                  }
                >
                  {cantidadDudosos > 0
                    ? `${cantidadDudosos} dato(s) dudoso(s)`
                    : "Todos los datos coinciden"}
                </Badge>
              </CardContent>
            </Card>

            {/* CAMPOS */}

            <div
              className="
                flex
                flex-col
                gap-4
              "
            >
              {campos.map(
                (campo) => (
                  <Card
                    key={
                      campo.campo
                    }
                    className={
                      campo.coincide
                        ? ""
                        : "border-amber-300"
                    }
                  >
                    <CardContent
                      className="p-5"
                    >
                      <div
                        className="
                          mb-4
                          flex
                          flex-wrap
                          items-center
                          justify-between
                          gap-2
                        "
                      >
                        <label
                          htmlFor={
                            campo.campo
                          }
                          className="
                            text-sm
                            font-semibold
                          "
                        >
                          {
                            campo.etiqueta
                          }
                        </label>

                        <Badge
                          variant={
                            campo.coincide
                              ? "success"
                              : "warning"
                          }
                        >
                          {campo.coincide
                            ? "Coincide"
                            : "Dato dudoso"}
                        </Badge>
                      </div>

                      <div
                        className="
                          mb-4
                          grid
                          gap-3
                          sm:grid-cols-2
                        "
                      >
                        <div
                          className="
                            rounded-base
                            border
                            border-border
                            bg-background
                            p-3
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wide
                              text-foreground
                              opacity-60
                            "
                          >
                            OCR
                          </span>

                          <p
                            className="
                              mt-2
                              break-words
                              text-sm
                            "
                          >
                            {
                              campo.valorOCR
                            }
                          </p>
                        </div>

                        <div
                          className="
                            rounded-base
                            border
                            border-border
                            bg-background
                            p-3
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wide
                              text-foreground
                              opacity-60
                            "
                          >
                            Base de Datos
                          </span>

                          <p
                            className="
                              mt-2
                              break-words
                              text-sm
                            "
                          >
                            {
                              campo.valorBaseDatos
                            }
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          mb-2
                          block
                          text-xs
                          font-medium
                          text-foreground
                          opacity-70
                        "
                      >
                        Valor final
                      </span>

                      <Input
                        id={
                          campo.campo
                        }
                        value={
                          campo.valorFinal
                        }
                        hasError={
                          !campo.coincide
                        }
                        onChange={(
                          event
                        ) =>
                          cambiarCampo(
                            campo.campo,
                            event.target.value
                          )
                        }
                      />

                      {!campo.coincide && (
                        <p
                          className="
                            mt-2
                            text-xs
                            font-medium
                            text-amber-700
                          "
                        >
                          Dato dudoso según
                          OCR: verifique con
                          la imagen.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            {/* ACCIONES */}

            <Card>
              <CardContent
                className="
                  flex
                  flex-col
                  gap-3
                  p-5
                  sm:flex-row
                  sm:justify-end
                "
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    derivarBoveda
                  }
                >
                  Derivar a Bóveda Física
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={
                    convalidarRegistro
                  }
                >
                  Convalidar y Guardar
                  Registro Oficial
                </Button>
              </CardContent>
            </Card>

          </div>
        </section>

      </section>

      {/* ================================= */}
      {/* MENSAJE */}
      {/* ================================= */}

      {mensaje && (
        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            w-[min(440px,calc(100vw-2rem))]
          "
        >
          <Card>
            <CardContent
              className="
                flex
                items-center
                justify-between
                gap-4
                p-4
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                "
              >
                {mensaje}
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMensaje(null)
                }
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

    </main>
  );
}

export default ConvalidacionEspejo;