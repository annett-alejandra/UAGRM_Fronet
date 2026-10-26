import {
  useMemo,
  useState,
} from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
} from "@/shared/ui";

import {
  SecretariaGeneralService,
} from "../classes/SecretariaGeneralService";

import {
  DobleAutenticacionService,
} from "../classes/DobleAutenticacionService";

import DobleAutenticacionModal from "../components/DobleAutenticacionModal";

import {
  secretariaGeneralMock,
} from "../mock/secretaria.mock";

import type {
  EstadoSecretariaGeneral,
  RegistroSecretariaGeneral,
} from "../types/dev3.types";

import type {
  FiltroEstadoSecretaria,
} from "../classes/SecretariaGeneralService";

const secretariaService =
  new SecretariaGeneralService();

const dobleAutenticacionService =
  new DobleAutenticacionService();

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger";

function SecretariaGeneral() {
  const [busqueda, setBusqueda] =
    useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] =
    useState<FiltroEstadoSecretaria>(
      "TODOS"
    );

  const [
    registroSeleccionado,
    setRegistroSeleccionado,
  ] =
    useState<RegistroSecretariaGeneral | null>(
      null
    );

  const [
    expiresAt,
    setExpiresAt,
  ] =
    useState<number | null>(
      null
    );

  const [
    errorSeguridad,
    setErrorSeguridad,
  ] =
    useState<string | null>(
      null
    );

  const [
    mensaje,
    setMensaje,
  ] =
    useState<string | null>(
      null
    );

  // ==========================================
  // FILTRADO
  // ==========================================

  const registrosFiltrados =
    useMemo(
      () =>
        secretariaService.filtrar(
          secretariaGeneralMock,
          busqueda,
          filtroEstado
        ),
      [
        busqueda,
        filtroEstado,
      ]
    );

  const registrosTabla =
    registrosFiltrados.map(
      (registro) => ({
        ...registro,
      })
    );

  // ==========================================
  // ESTADOS VISUALES
  // ==========================================

  function obtenerBadgeEstado(
    estado:
      EstadoSecretariaGeneral
  ): BadgeVariant {
    switch (estado) {
      case "APROBADO":
        return "success";

      case "RECHAZADO":
        return "danger";

      default:
        return "warning";
    }
  }

  function obtenerTextoEstado(
    estado:
      EstadoSecretariaGeneral
  ) {
    switch (estado) {
      case "APROBADO":
        return "Aprobado";

      case "RECHAZADO":
        return "Rechazado";

      default:
        return "Pendiente";
    }
  }

  function cambiarFiltro(
    estado:
      FiltroEstadoSecretaria
  ) {
    setFiltroEstado(
      estado
    );
  }

  // ==========================================
  // DOBLE AUTENTICACIÓN
  // ==========================================

  function abrirSeguridad(
    registro:
      RegistroSecretariaGeneral
  ) {
    setRegistroSeleccionado(
      registro
    );

    setExpiresAt(
      dobleAutenticacionService
        .crearExpiracion()
    );

    setErrorSeguridad(
      null
    );
  }

  function cerrarSeguridad() {
    setRegistroSeleccionado(
      null
    );

    setExpiresAt(
      null
    );

    setErrorSeguridad(
      null
    );
  }

  function confirmarDobleAutenticacion(
    codigo: string
  ) {
    if (
      !registroSeleccionado ||
      expiresAt === null
    ) {
      return;
    }

    if (
      dobleAutenticacionService
        .estaExpirada(
          expiresAt
        )
    ) {
      setErrorSeguridad(
        "La autorización temporal expiró. Solicite una nueva ventana de firma."
      );

      return;
    }

    if (
      !dobleAutenticacionService
        .validarCodigo(
          codigo
        )
    ) {
      setErrorSeguridad(
        "El código ingresado no tiene un formato válido."
      );

      return;
    }

    /*
     * PUNTO DE INTEGRACIÓN BACKEND
     *
     * Aquí se enviará el código 2FA
     * y el identificador del trámite
     * al endpoint de seguridad.
     *
     * No se simula una aprobación
     * porque todavía no contamos con
     * el contrato real del backend.
     */

    setErrorSeguridad(
      "La interfaz de doble autenticación está lista. Falta conectar el endpoint de validación proporcionado por backend."
    );
  }

  return (
    <>
      <main
        className="
          min-h-full
          bg-background
          p-6
          text-foreground
          lg:p-8
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-6
          "
        >
          {/* ================================= */}
          {/* ENCABEZADO */}
          {/* ================================= */}

          <header>
            <Badge variant="neutral">
              Secretaría General
            </Badge>

            <h1
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-primary
              "
            >
              Bandeja Administrativa
            </h1>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                text-foreground
                opacity-60
              "
            >
              Control y seguimiento de
              trámites remitidos a
              Secretaría General.
            </p>
          </header>

          {/* ================================= */}
          {/* FLASHCARDS */}
          {/* ================================= */}

          <section
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <Card>
              <CardHeader
                className="pb-2"
              >
                <CardDescription>
                  Todos
                </CardDescription>

                <CardTitle
                  className="
                    text-3xl
                    text-primary
                  "
                >
                  {secretariaService.contarTodos(
                    secretariaGeneralMock
                  )}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader
                className="pb-2"
              >
                <CardDescription>
                  Pendientes
                </CardDescription>

                <CardTitle
                  className="
                    text-3xl
                    text-primary
                  "
                >
                  {secretariaService.contarPendientes(
                    secretariaGeneralMock
                  )}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader
                className="pb-2"
              >
                <CardDescription>
                  Aprobados
                </CardDescription>

                <CardTitle
                  className="
                    text-3xl
                    text-primary
                  "
                >
                  {secretariaService.contarAprobados(
                    secretariaGeneralMock
                  )}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader
                className="pb-2"
              >
                <CardDescription>
                  Rechazados
                </CardDescription>

                <CardTitle
                  className="
                    text-3xl
                    text-primary
                  "
                >
                  {secretariaService.contarRechazados(
                    secretariaGeneralMock
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </section>

          {/* ================================= */}
          {/* CAJA DE HERRAMIENTAS */}
          {/* ================================= */}

          <Card>
            <CardHeader>
              <CardTitle>
                Caja de herramientas
              </CardTitle>

              <CardDescription>
                Busque trámites y filtre
                la bandeja según su
                estado.
              </CardDescription>
            </CardHeader>

            <CardContent
              className="
                flex
                flex-col
                gap-5
              "
            >
              <div>
                <label
                  htmlFor="busquedaSecretaria"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Buscar trámite
                </label>

                <Input
                  id="busquedaSecretaria"
                  placeholder="RUT, C.I., nombre o carrera"
                  value={busqueda}
                  onChange={(
                    event
                  ) =>
                    setBusqueda(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Estado
                </span>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      filtroEstado ===
                      "TODOS"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      filtroEstado ===
                      "TODOS"
                    }
                    onClick={() =>
                      cambiarFiltro(
                        "TODOS"
                      )
                    }
                  >
                    Todos
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={
                      filtroEstado ===
                      "PENDIENTE"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      filtroEstado ===
                      "PENDIENTE"
                    }
                    onClick={() =>
                      cambiarFiltro(
                        "PENDIENTE"
                      )
                    }
                  >
                    Pendientes
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={
                      filtroEstado ===
                      "APROBADO"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      filtroEstado ===
                      "APROBADO"
                    }
                    onClick={() =>
                      cambiarFiltro(
                        "APROBADO"
                      )
                    }
                  >
                    Aprobados
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={
                      filtroEstado ===
                      "RECHAZADO"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      filtroEstado ===
                      "RECHAZADO"
                    }
                    onClick={() =>
                      cambiarFiltro(
                        "RECHAZADO"
                      )
                    }
                  >
                    Rechazados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ================================= */}
          {/* BANDEJA */}
          {/* ================================= */}

          <Card>
            <CardHeader>
              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <CardTitle>
                    Trámites
                  </CardTitle>

                  <CardDescription>
                    Bandeja administrativa
                    de Secretaría General.
                  </CardDescription>
                </div>

                <Badge variant="neutral">
                  {
                    registrosFiltrados.length
                  }{" "}
                  registro(s)
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <Table
                data={
                  registrosTabla
                }
                getRowKey={(row) =>
                  row.id
                }
                emptyMessage="No existen trámites que coincidan con los filtros seleccionados."
                columns={[
                  {
                    key: "rut",
                    header: "RUT",
                    sortable: true,
                    render: (
                      row
                    ) => (
                      <span
                        className="
                          font-semibold
                          text-primary
                        "
                      >
                        {row.rut}
                      </span>
                    ),
                  },

                  {
                    key: "ci",
                    header: "C.I.",
                    sortable: true,
                  },

                  {
                    key:
                      "nombreCompleto",
                    header:
                      "Nombre",
                    sortable: true,
                  },

                  {
                    key:
                      "carrera",
                    header:
                      "Carrera",
                    sortable: true,
                  },

                  {
                    key:
                      "tipoTramite",
                    header:
                      "Trámite",
                  },

                  {
                    key:
                      "fechaIngreso",
                    header:
                      "Fecha",
                    sortable: true,
                  },

                  {
                    key:
                      "estado",
                    header:
                      "Estado",
                    render: (
                      row
                    ) => (
                      <Badge
                        variant={obtenerBadgeEstado(
                          row.estado
                        )}
                      >
                        {obtenerTextoEstado(
                          row.estado
                        )}
                      </Badge>
                    ),
                  },

                  {
                    key:
                      "acciones",
                    header:
                      "Acción",
                    render: (
                      row
                    ) =>
                      row.estado ===
                      "PENDIENTE" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            abrirSeguridad(
                              row
                            )
                          }
                        >
                          Autorizar firma
                        </Button>
                      ) : (
                        <span
                          className="
                            text-sm
                            text-foreground
                            opacity-50
                          "
                        >
                          —
                        </span>
                      ),
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* ================================= */}
          {/* INFORMACIÓN DE SEGURIDAD */}
          {/* ================================= */}

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
                <strong
                  className="
                    block
                    text-sm
                  "
                >
                  Firma protegida por
                  doble autenticación
                </strong>

                <p
                  className="
                    mt-1
                    text-sm
                    text-foreground
                    opacity-60
                  "
                >
                  Las operaciones de
                  firma requieren una
                  autorización temporal
                  con vigencia máxima de
                  cinco minutos.
                </p>
              </div>

              <Badge variant="success">
                Seguridad activa
              </Badge>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* =================================== */}
      {/* MODAL 2FA */}
      {/* =================================== */}

      {registroSeleccionado &&
        expiresAt !== null && (
          <DobleAutenticacionModal
            key={expiresAt}
            isOpen
            expiresAt={
              expiresAt
            }
            onClose={
              cerrarSeguridad
            }
            onConfirm={
              confirmarDobleAutenticacion
            }
            error={
              errorSeguridad
            }
          />
        )}

      {/* =================================== */}
      {/* MENSAJE */}
      {/* =================================== */}

      {mensaje && (
        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            w-[min(420px,calc(100vw-2rem))]
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
                  setMensaje(
                    null
                  )
                }
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default SecretariaGeneral;