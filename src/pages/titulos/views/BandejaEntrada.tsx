import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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
  BandejaArchivoService,
} from "../classes/BandejaArchivoService";

import {
  bandejaArchivoMock,
} from "../mock/bandeja.mock";

import type {
  EstadoEntradaArchivo,
} from "../types/titulos-gestion.types";

const bandejaService =
  new BandejaArchivoService();

type FiltroEstado =
  | EstadoEntradaArchivo
  | "TODOS";

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger";

function BandejaEntrada() {
  const navigate =
    useNavigate();

  const [busqueda, setBusqueda] =
    useState("");

  const [estado, setEstado] =
    useState<FiltroEstado>(
      "TODOS"
    );

  // ==========================================
  // FILTROS
  // ==========================================

  const entradasFiltradas =
    useMemo(
      () =>
        bandejaService.filtrarEntradas(
          bandejaArchivoMock,
          busqueda,
          estado
        ),
      [
        busqueda,
        estado,
      ]
    );

  const entradasTabla =
    entradasFiltradas.map(
      (entrada) => ({
        ...entrada,
      })
    );

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  function abrirConvalidacion(
    expedienteId: string
  ) {
    navigate(
      `/archivo/convalidacion?expediente=${encodeURIComponent(
        expedienteId
      )}`
    );
  }

  // ==========================================
  // ESTADOS
  // ==========================================

  function obtenerBadgeEstado(
    estadoEntrada:
      EstadoEntradaArchivo
  ): BadgeVariant {
    switch (estadoEntrada) {
      case "PRIORITARIO":
        return "danger";

      case "EN_REVISION":
        return "warning";

      default:
        return "neutral";
    }
  }

  function obtenerTextoEstado(
    estadoEntrada:
      EstadoEntradaArchivo
  ) {
    switch (estadoEntrada) {
      case "PRIORITARIO":
        return "Prioritario";

      case "EN_REVISION":
        return "En revisión";

      default:
        return "Pendiente";
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
            Archivo Central
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
            Bandeja de Entrada
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
            Expedientes pendientes de
            revisión y convalidación
            documental.
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
                Total
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  bandejaArchivoMock.length
                }
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
                {bandejaService.contarPendientes(
                  bandejaArchivoMock
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                En revisión
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {bandejaService.contarEnRevision(
                  bandejaArchivoMock
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Prioritarios
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {bandejaService.contarPrioritarios(
                  bandejaArchivoMock
                )}
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
              Localice expedientes por
              RUT, C.I., nombre o estado.
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
                htmlFor="busquedaEntrada"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Buscar expediente
              </label>

              <Input
                id="busquedaEntrada"
                placeholder="RUT, C.I. o nombre"
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
                    "EN_REVISION"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado ===
                    "EN_REVISION"
                  }
                  onClick={() =>
                    setEstado(
                      "EN_REVISION"
                    )
                  }
                >
                  En revisión
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={
                    estado ===
                    "PRIORITARIO"
                      ? "primary"
                      : "outline"
                  }
                  aria-pressed={
                    estado ===
                    "PRIORITARIO"
                  }
                  onClick={() =>
                    setEstado(
                      "PRIORITARIO"
                    )
                  }
                >
                  Prioritario
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* TABLA */}
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
                  Expedientes recibidos
                </CardTitle>

                <CardDescription>
                  {
                    entradasFiltradas.length
                  }{" "}
                  registro(s) encontrados.
                </CardDescription>
              </div>

              <Badge variant="neutral">
                {
                  entradasFiltradas.length
                }{" "}
                resultados
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Table
              data={
                entradasTabla
              }
              getRowKey={(row) =>
                row.id
              }
              emptyMessage="No existen expedientes que coincidan con los filtros seleccionados."
              columns={[
                {
                  key: "rut",
                  header: "RUT",
                  sortable: true,
                  render: (row) => (
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
                  key: "nombreCompleto",
                  header: "Nombre",
                  sortable: true,
                },

                {
                  key: "tipoDocumento",
                  header: "Documento",
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
                    <Badge variant="neutral">
                      {row.origen ===
                      "INDIVIDUAL"
                        ? "Individual"
                        : row.institucion ??
                          "Institucional"}
                    </Badge>
                  ),
                },

                {
                  key: "fechaIngreso",
                  header: "Fecha",
                  sortable: true,
                },

                {
                  key: "estado",
                  header: "Estado",
                  render: (row) => (
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
                  key: "acciones",
                  header: "Acción",
                  render: (row) => (
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        abrirConvalidacion(
                          row.id
                        )
                      }
                    >
                      Convalidar
                    </Button>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>

      </div>
    </main>
  );
}

export default BandejaEntrada;