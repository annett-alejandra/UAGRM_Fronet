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
  lotesInstitucionalesMock,
} from "../mock/titulos-gestion.mock";

import type {
  LoteInstitucional,
} from "../types/titulos-gestion.types";

const lotesService =
  new LotesService();

type FiltroEstado =
  | "TODOS"
  | "PENDIENTE"
  | "EN_PROCESO"
  | "COMPLETADO";

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger";

function LotesInstitucionales() {
  const [busqueda, setBusqueda] =
    useState("");

  const [estado, setEstado] =
    useState<FiltroEstado>("TODOS");

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
  // FILTROS
  // ==========================================

  const lotesFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return lotesInstitucionalesMock.filter(
        (lote) => {
          const coincideTexto =
            texto === "" ||
            lote.nombre
              .toLowerCase()
              .includes(texto) ||
            lote.institucion
              .toLowerCase()
              .includes(texto) ||
            lote.id
              .toLowerCase()
              .includes(texto);

          const coincideEstado =
            estado === "TODOS" ||
            lote.estado === estado;

          return (
            coincideTexto &&
            coincideEstado
          );
        }
      );
    }, [
      busqueda,
      estado,
    ]);

  // ==========================================
  // RESUMEN
  // ==========================================

  const totalEnProceso =
    lotesInstitucionalesMock.filter(
      (lote) =>
        lote.estado ===
        "EN_PROCESO"
    ).length;

  const totalCompletados =
    lotesInstitucionalesMock.filter(
      (lote) =>
        lote.estado ===
        "COMPLETADO"
    ).length;

  // ==========================================
  // MODAL
  // ==========================================

  function verDetalle(
    lote: LoteInstitucional
  ) {
    setLoteSeleccionado(lote);
  }

  function cerrarDetalle() {
    setLoteSeleccionado(null);
  }

  // ==========================================
  // DESPACHAR
  // ==========================================

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
  // BADGES
  // ==========================================

  function obtenerBadgeLote(
    estadoLote: string
  ): BadgeVariant {
    switch (estadoLote) {
      case "COMPLETADO":
        return "success";

      case "EN_PROCESO":
        return "warning";

      default:
        return "neutral";
    }
  }

  function obtenerBadgeIntegrante(
    estadoIntegrante: string
  ): BadgeVariant {
    switch (
      estadoIntegrante
    ) {
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

  function formatearEstado(
    valor: string
  ) {
    switch (valor) {
      case "EN_PROCESO":
        return "En proceso";

      case "COMPLETADO":
        return "Completado";

      case "CONVALIDADO":
        return "Convalidado";

      case "OBSERVADO":
        return "Observado";

      case "PENDIENTE":
        return "Pendiente";

      default:
        return valor;
    }
  }

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
            Lotes Institucionales
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
            Gestión y seguimiento de
            paquetes remitidos por
            instituciones con convenio.
          </p>
        </header>

        {/* ================================= */}
        {/* RESUMEN */}
        {/* ================================= */}

        <section
          className="
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Total de lotes
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

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                En proceso
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  totalEnProceso
                }
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Completados
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  totalCompletados
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
              Localice lotes por
              institución, nombre,
              código o estado.
            </CardDescription>
          </CardHeader>

          <CardContent
            className="
              grid
              gap-5
              lg:grid-cols-[minmax(0,1fr)_auto]
            "
          >
            <div>
              <label
                htmlFor="buscarLote"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Buscar lote
              </label>

              <Input
                id="buscarLote"
                placeholder="Entidad, nombre o código"
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
                    estado === "TODOS"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado === "TODOS"
                  }
                  onClick={() =>
                    setEstado(
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
                    estado ===
                    "PENDIENTE"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado ===
                    "PENDIENTE"
                  }
                  onClick={() =>
                    setEstado(
                      "PENDIENTE"
                    )
                  }
                >
                  Pendiente
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={
                    estado ===
                    "EN_PROCESO"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado ===
                    "EN_PROCESO"
                  }
                  onClick={() =>
                    setEstado(
                      "EN_PROCESO"
                    )
                  }
                >
                  En proceso
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={
                    estado ===
                    "COMPLETADO"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado ===
                    "COMPLETADO"
                  }
                  onClick={() =>
                    setEstado(
                      "COMPLETADO"
                    )
                  }
                >
                  Completado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* LOTES */}
        {/* ================================= */}

        <section>
          <div
            className="
              mb-4
              flex
              items-end
              justify-between
              gap-4
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
                Paquetes institucionales
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-foreground
                  opacity-60
                "
              >
                {
                  lotesFiltrados.length
                }{" "}
                lote(s) encontrados.
              </p>
            </div>

            <Badge variant="neutral">
              {
                lotesFiltrados.length
              }{" "}
              resultados
            </Badge>
          </div>

          {lotesFiltrados.length >
          0 ? (
            <div
              className="
                grid
                gap-4
                xl:grid-cols-2
              "
            >
              {lotesFiltrados.map(
                (lote) => {
                  const progreso =
                    lotesService.calcularProgreso(
                      lote
                    );

                  const puedeDespacharse =
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
                              variant={obtenerBadgeLote(
                                lote.estado
                              )}
                            >
                              {formatearEstado(
                                lote.estado
                              )}
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
                            </CardDescription>
                          </div>

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-foreground
                              opacity-60
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
                            grid-cols-2
                            gap-3
                            sm:grid-cols-4
                          "
                        >
                          <Card>
                            <CardContent
                              className="p-3"
                            >
                              <span
                                className="
                                  text-xs
                                  text-foreground
                                  opacity-60
                                "
                              >
                                Fecha
                              </span>

                              <strong
                                className="
                                  mt-1
                                  block
                                  text-sm
                                  text-primary
                                "
                              >
                                {
                                  lote.fecha
                                }
                              </strong>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent
                              className="p-3"
                            >
                              <span
                                className="
                                  text-xs
                                  text-foreground
                                  opacity-60
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
                                {
                                  lote.total
                                }
                              </strong>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent
                              className="p-3"
                            >
                              <span
                                className="
                                  text-xs
                                  text-foreground
                                  opacity-60
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
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent
                              className="p-3"
                            >
                              <span
                                className="
                                  text-xs
                                  text-foreground
                                  opacity-60
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
                            </CardContent>
                          </Card>
                        </div>

                        <ProgressBar
                          value={
                            progreso
                          }
                          label={lotesService.obtenerTextoProgreso(
                            lote
                          )}
                          color={
                            progreso ===
                            100
                              ? "success"
                              : "primary"
                          }
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
                              verDetalle(
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
                              !puedeDespacharse
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
          ) : (
            <Card>
              <CardContent
                className="
                  p-10
                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    text-foreground
                    opacity-60
                  "
                >
                  No existen lotes que
                  coincidan con los
                  filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

      </div>

      {/* =================================== */}
      {/* MODAL DETALLE */}
      {/* =================================== */}

      <Modal
        isOpen={
          loteSeleccionado !== null
        }
        onClose={
          cerrarDetalle
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
                  cerrarDetalle
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
                  text-foreground
                  opacity-60
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
                        text-foreground
                        opacity-60
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
                        text-foreground
                        opacity-60
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
                        text-foreground
                        opacity-60
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
                        text-foreground
                        opacity-60
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
                  key: "estado",
                  header: "Estado",
                  render: (row) => (
                    <Badge
                      variant={obtenerBadgeIntegrante(
                        row.estado
                      )}
                    >
                      {formatearEstado(
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

export default LotesInstitucionales;