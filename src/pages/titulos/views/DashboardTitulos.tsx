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
  Modal,
  ProgressBar,
  Table,
} from "@/shared/ui";

import {
  LotesService,
} from "../classes/LotesService";

import {
  TitulosService,
} from "../classes/TitulosService";

import {
  lotesInstitucionalesMock,
  solicitudesTitulosMock,
} from "../mock/titulos-gestion.mock";

import type {
  EstadoSolicitud,
  LoteInstitucional,
  OrigenSolicitud,
} from "../types/titulos-gestion.types";

const titulosService =
  new TitulosService();

const lotesService =
  new LotesService();

type FiltroOrigen =
  | OrigenSolicitud
  | "TODOS";

function DashboardTitulos() {
  const [busqueda, setBusqueda] =
    useState("");

  const [origen, setOrigen] =
    useState<FiltroOrigen>("TODOS");

  const [
    institucion,
    setInstitucion,
  ] = useState("TODAS");

  const [
    loteSeleccionado,
    setLoteSeleccionado,
  ] =
    useState<LoteInstitucional | null>(
      null
    );

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  // ==========================================
  // INSTITUCIONES
  // ==========================================

  const instituciones =
    useMemo(
      () =>
        titulosService.obtenerInstituciones(
          solicitudesTitulosMock
        ),
      []
    );

  // ==========================================
  // SOLICITUDES FILTRADAS
  // ==========================================

  const solicitudesFiltradas =
    useMemo(
      () =>
        titulosService.filtrarSolicitudes(
          solicitudesTitulosMock,
          busqueda,
          origen,
          institucion
        ),
      [
        busqueda,
        origen,
        institucion,
      ]
    );

  // Convertimos a objetos simples para el
  // componente institucional Table.
  const solicitudesTabla =
    solicitudesFiltradas.map(
      (solicitud) => ({
        ...solicitud,
      })
    );

  // ==========================================
  // BADGES
  // ==========================================

  function obtenerEstadoBadge(
    estado: EstadoSolicitud
  ):
    | "neutral"
    | "success"
    | "warning"
    | "danger" {
    switch (estado) {
      case "CONVALIDADO":
        return "success";

      case "OBSERVADO":
        return "danger";

      case "EN_PROCESO":
        return "warning";

      default:
        return "neutral";
    }
  }

  function obtenerTextoEstado(
    estado: EstadoSolicitud
  ) {
    switch (estado) {
      case "EN_PROCESO":
        return "En proceso";

      case "CONVALIDADO":
        return "Convalidado";

      case "OBSERVADO":
        return "Observado";

      default:
        return "Pendiente";
    }
  }

  // ==========================================
  // FILTRO ORIGEN
  // ==========================================

  function cambiarOrigen(
    nuevoOrigen: FiltroOrigen
  ) {
    setOrigen(nuevoOrigen);

    if (
      nuevoOrigen !==
      "INSTITUCIONAL"
    ) {
      setInstitucion("TODAS");
    }
  }

  // ==========================================
  // LOTE
  // ==========================================

  function verDetalleLote(
    lote: LoteInstitucional
  ) {
    setLoteSeleccionado(lote);
  }

  function cerrarDetalleLote() {
    setLoteSeleccionado(null);
  }

  function despacharLote(
    lote: LoteInstitucional
  ) {
    const validacion =
      lotesService.puedeDespacharConMensaje(
        lote
      );

    if (!validacion.permitido) {
      setMensaje(
        validacion.mensaje
      );

      return;
    }

    const confirmar =
      window.confirm(
        `¿Confirma el despacho de "${lote.nombre}" a Secretaría General?`
      );

    if (!confirmar) {
      return;
    }

    setMensaje(
      `${lote.nombre} fue despachado correctamente a Secretaría General.`
    );

    setLoteSeleccionado(null);
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
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
            Títulos
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
            Dashboard de Emisión
          </h1>

          <p
            className="
              mt-2
              max-w-3xl
              text-sm
              text-slate-500
            "
          >
            Gestión de solicitudes
            individuales y lotes
            institucionales para emisión
            de títulos.
          </p>
        </header>

        {/* ================================= */}
        {/* RESUMEN */}
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
                Solicitudes
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  solicitudesTitulosMock.length
                }
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Individuales
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  solicitudesTitulosMock.filter(
                    (solicitud) =>
                      solicitud.origen ===
                      "INDIVIDUAL"
                  ).length
                }
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Institucionales
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  solicitudesTitulosMock.filter(
                    (solicitud) =>
                      solicitud.origen ===
                      "INSTITUCIONAL"
                  ).length
                }
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Lotes
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  lotesInstitucionalesMock.length
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        {/* ================================= */}
        {/* FILTROS */}
        {/* ================================= */}

        <Card>
          <CardHeader>
            <CardTitle>
              Buscar y filtrar
            </CardTitle>

            <CardDescription>
              Localice solicitudes por
              C.I., nombre, origen o
              institución.
            </CardDescription>
          </CardHeader>

          <CardContent
            className="
              flex
              flex-col
              gap-5
            "
          >
            <div
              className="
                grid
                gap-5
                lg:grid-cols-[minmax(0,1fr)_auto]
              "
            >
              <div>
                <label
                  htmlFor="buscarSolicitud"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Buscar solicitud
                </label>

                <Input
                  id="buscarSolicitud"
                  placeholder="C.I. o nombre completo"
                  value={busqueda}
                  onChange={(event) =>
                    setBusqueda(
                      event.target.value
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
                  Origen
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
                      origen === "TODOS"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      origen === "TODOS"
                    }
                    onClick={() =>
                      cambiarOrigen(
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
                      origen ===
                      "INDIVIDUAL"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      origen ===
                      "INDIVIDUAL"
                    }
                    onClick={() =>
                      cambiarOrigen(
                        "INDIVIDUAL"
                      )
                    }
                  >
                    Solicitud Individual
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={
                      origen ===
                      "INSTITUCIONAL"
                        ? "primary"
                        : "outline"
                    }
                    aria-pressed={
                      origen ===
                      "INSTITUCIONAL"
                    }
                    onClick={() =>
                      cambiarOrigen(
                        "INSTITUCIONAL"
                      )
                    }
                  >
                    Lote Institución
                  </Button>
                </div>
              </div>
            </div>

            {origen ===
              "INSTITUCIONAL" && (
              <div>
                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Institución
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
                      institucion ===
                      "TODAS"
                        ? "secondary"
                        : "outline"
                    }
                    onClick={() =>
                      setInstitucion(
                        "TODAS"
                      )
                    }
                  >
                    Todas
                  </Button>

                  {instituciones.map(
                    (
                      nombreInstitucion
                    ) => (
                      <Button
                        key={
                          nombreInstitucion
                        }
                        type="button"
                        size="sm"
                        variant={
                          institucion ===
                          nombreInstitucion
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() =>
                          setInstitucion(
                            nombreInstitucion
                          )
                        }
                      >
                        {
                          nombreInstitucion
                        }
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* TABLA SOLICITUDES */}
        {/* ================================= */}

        <Card>
          <CardHeader>
            <div
              className="
                flex
                flex-col
                gap-1
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <CardTitle>
                  Solicitudes
                </CardTitle>

                <CardDescription>
                  {
                    solicitudesFiltradas.length
                  }{" "}
                  registro(s) encontrados.
                </CardDescription>
              </div>

              <Badge variant="neutral">
                {
                  solicitudesFiltradas.length
                }{" "}
                resultados
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Table
              data={
                solicitudesTabla
              }
              getRowKey={(row) =>
                row.id
              }
              emptyMessage="No existen solicitudes que coincidan con los filtros seleccionados."
              columns={[
                {
                  key: "ci",
                  header: "C.I.",
                  sortable: true,
                },

                {
                  key: "nombreCompleto",
                  header: "Nombre",
                  sortable: true,
                },

                {
                  key: "carrera",
                  header: "Carrera",
                  sortable: true,
                },

                {
                  key: "gestionEmision",
                  header: "Gestión",
                  sortable: true,
                },

                {
                  key: "origen",
                  header: "Origen",
                  render: (row) => (
                    <Badge
                      variant="neutral"
                    >
                      {row.origen ===
                      "INDIVIDUAL"
                        ? "Individual"
                        : "Institucional"}
                    </Badge>
                  ),
                },

                {
                  key: "institucion",
                  header: "Institución",
                  render: (row) =>
                    row.institucion ??
                    "—",
                },

                {
                  key: "estado",
                  header: "Estado",
                  render: (row) => (
                    <Badge
                      variant={obtenerEstadoBadge(
                        row.estado
                      )}
                    >
                      {obtenerTextoEstado(
                        row.estado
                      )}
                    </Badge>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* LOTES INSTITUCIONALES */}
        {/* ================================= */}

        <section>
          <div
            className="
              mb-4
              flex
              flex-col
              gap-1
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-xl
                  font-semibold
                  text-primary
                "
              >
                Lotes Institucionales
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Paquetes agrupados por
                institución y fecha.
              </p>
            </div>

            <Badge variant="neutral">
              {
                lotesInstitucionalesMock.length
              }{" "}
              lotes
            </Badge>
          </div>

          <div
            className="
              grid
              gap-4
              xl:grid-cols-2
            "
          >
            {lotesInstitucionalesMock.map(
              (lote) => {
                const progreso =
                  lotesService.calcularProgreso(
                    lote
                  );

                const despachable =
                  lotesService.puedeDespacharse(
                    lote
                  );

                return (
                  <Card
                    key={lote.id}
                  >
                    <CardHeader>
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <Badge
                            variant={
                              lote.estado ===
                              "COMPLETADO"
                                ? "success"
                                : lote.estado ===
                                    "EN_PROCESO"
                                  ? "warning"
                                  : "neutral"
                            }
                          >
                            {
                              lote.estado
                            }
                          </Badge>

                          <CardTitle
                            className="
                              mt-3
                              text-primary
                            "
                          >
                            {lote.nombre}
                          </CardTitle>

                          <CardDescription>
                            {
                              lote.institucion
                            }
                            {" · "}
                            {lote.fecha}
                          </CardDescription>
                        </div>

                        <span
                          className="
                            text-xs
                            font-semibold
                            text-slate-500
                          "
                        >
                          {lote.id}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div
                        className="
                          mb-5
                          grid
                          grid-cols-3
                          gap-3
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
                              block
                              text-xs
                              text-slate-500
                            "
                          >
                            Total
                          </span>

                          <strong
                            className="
                              mt-1
                              block
                              text-lg
                              text-primary
                            "
                          >
                            {lote.total}
                          </strong>
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
                              block
                              text-xs
                              text-slate-500
                            "
                          >
                            Procesados
                          </span>

                          <strong
                            className="
                              mt-1
                              block
                              text-lg
                              text-primary
                            "
                          >
                            {
                              lote.procesados
                            }
                          </strong>
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
                              block
                              text-xs
                              text-slate-500
                            "
                          >
                            Pendientes
                          </span>

                          <strong
                            className="
                              mt-1
                              block
                              text-lg
                              text-primary
                            "
                          >
                            {lotesService.obtenerPendientes(
                              lote
                            )}
                          </strong>
                        </div>
                      </div>

                      <ProgressBar
                        value={
                          progreso
                        }
                        label={
                          lotesService.obtenerTextoProgreso(
                            lote
                          )
                        }
                        color={
                          progreso === 100
                            ? "success"
                            : "primary"
                        }
                        size="md"
                      />

                      <div
                        className="
                          mt-5
                          flex
                          flex-col
                          gap-2
                          sm:flex-row
                        "
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            verDetalleLote(
                              lote
                            )
                          }
                        >
                          Ver Detalle del Lote
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          className="flex-1"
                          disabled={
                            !despachable
                          }
                          onClick={() =>
                            despacharLote(
                              lote
                            )
                          }
                        >
                          Despachar a Secretaría
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </section>

      </div>

      {/* =================================== */}
      {/* MODAL DETALLE LOTE */}
      {/* =================================== */}

      <Modal
        isOpen={
          loteSeleccionado !== null
        }
        onClose={
          cerrarDetalleLote
        }
        title={
          loteSeleccionado
            ? loteSeleccionado.nombre
            : undefined
        }
        size="xl"
        footer={
          loteSeleccionado ? (
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
                onClick={
                  cerrarDetalleLote
                }
              >
                Cerrar
              </Button>

              <Button
                type="button"
                variant="primary"
                disabled={
                  !lotesService.puedeDespacharse(
                    loteSeleccionado
                  )
                }
                onClick={() =>
                  despacharLote(
                    loteSeleccionado
                  )
                }
              >
                Despachar a Secretaría
              </Button>
            </div>
          ) : undefined
        }
      >
        {loteSeleccionado && (
          <div
            className="
              flex
              flex-col
              gap-5
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {
                  loteSeleccionado.institucion
                }
                {" · "}
                {
                  loteSeleccionado.fecha
                }
              </p>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-3
                  lg:grid-cols-4
                "
              >
                <Card>
                  <CardContent
                    className="p-4"
                  >
                    <span
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      Total
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        text-xl
                        text-primary
                      "
                    >
                      {
                        loteSeleccionado.total
                      }
                    </strong>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent
                    className="p-4"
                  >
                    <span
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      Procesados
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        text-xl
                        text-primary
                      "
                    >
                      {
                        loteSeleccionado.procesados
                      }
                    </strong>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent
                    className="p-4"
                  >
                    <span
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      Pendientes
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        text-xl
                        text-primary
                      "
                    >
                      {lotesService.obtenerPendientes(
                        loteSeleccionado
                      )}
                    </strong>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent
                    className="p-4"
                  >
                    <span
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      Progreso
                    </span>

                    <strong
                      className="
                        mt-1
                        block
                        text-xl
                        text-primary
                      "
                    >
                      {lotesService.calcularProgreso(
                        loteSeleccionado
                      )}
                      %
                    </strong>
                  </CardContent>
                </Card>
              </div>
            </div>

            <ProgressBar
              value={lotesService.calcularProgreso(
                loteSeleccionado
              )}
              label="Procesamiento del lote"
              color={
                lotesService.calcularProgreso(
                  loteSeleccionado
                ) === 100
                  ? "success"
                  : "primary"
              }
            />

            <Table
              data={loteSeleccionado.integrantes.map(
                (integrante) => ({
                  ...integrante,
                })
              )}
              getRowKey={(row) =>
                row.id
              }
              emptyMessage="El lote no tiene integrantes registrados."
              columns={[
                {
                  key: "ci",
                  header: "C.I.",
                },

                {
                  key: "nombreCompleto",
                  header: "Nombre",
                },

                {
                  key: "carrera",
                  header: "Carrera",
                },

                {
                  key: "estado",
                  header: "Estado",
                  render: (row) => (
                    <Badge
                      variant={obtenerEstadoBadge(
                        row.estado
                      )}
                    >
                      {obtenerTextoEstado(
                        row.estado
                      )}
                    </Badge>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

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

export default DashboardTitulos;