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
  BovedaService,
} from "../classes/BovedaService";

import type {
  RegistroBoveda,
} from "../types/titulos-gestion.types";

const bovedaService =
  new BovedaService();

function BovedaHistorica() {
  const navigate =
    useNavigate();

  const [busqueda, setBusqueda] =
    useState("");

  const [registros] =
    useState<RegistroBoveda[]>(
      () =>
        bovedaService.obtenerRegistros()
    );

  // ==========================================
  // FILTROS
  // ==========================================

  const registrosFiltrados =
    useMemo(
      () =>
        bovedaService.filtrar(
          registros,
          busqueda
        ),
      [
        registros,
        busqueda,
      ]
    );

  const registrosTabla =
    registrosFiltrados.map(
      (registro) => ({
        ...registro,
      })
    );

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  function revisarExpediente(
    expedienteId: string
  ) {
    navigate(
      `/archivo/convalidacion?expediente=${encodeURIComponent(
        expedienteId
      )}`
    );
  }

  // ==========================================
  // FORMATO
  // ==========================================

  function formatearTipoDocumento(
    tipoDocumento: string
  ) {
    return tipoDocumento
      .replaceAll("_", " ");
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
            Bóveda Histórica
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
            Consulta de documentos
            derivados al archivo físico
            institucional.
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
          "
        >
          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Documentos archivados
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {registros.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader
              className="pb-2"
            >
              <CardDescription>
                Resultados mostrados
              </CardDescription>

              <CardTitle
                className="
                  text-3xl
                  text-primary
                "
              >
                {
                  registrosFiltrados.length
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        {/* ================================= */}
        {/* BUSCADOR */}
        {/* ================================= */}

        <Card>
          <CardHeader>
            <CardTitle>
              Buscar documento
            </CardTitle>

            <CardDescription>
              Busque por expediente, RUT,
              C.I., titular o ubicación
              física.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <label
              htmlFor="buscarBoveda"
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Criterio de búsqueda
            </label>

            <Input
              id="buscarBoveda"
              placeholder="Expediente, RUT, C.I., titular o ubicación"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
            />
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* REGISTROS */}
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
                  Registros Históricos
                </CardTitle>

                <CardDescription>
                  Documentación derivada
                  a archivo físico.
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
              emptyMessage={
                registros.length === 0
                  ? "Todavía no existen documentos derivados a la Bóveda Histórica."
                  : "No existen registros que coincidan con la búsqueda."
              }
              columns={[
                {
                  key: "expedienteId",
                  header: "Expediente",
                  sortable: true,
                  render: (row) => (
                    <span
                      className="
                        font-semibold
                        text-primary
                      "
                    >
                      {
                        row.expedienteId
                      }
                    </span>
                  ),
                },

                {
                  key: "rut",
                  header: "RUT",
                  sortable: true,
                },

                {
                  key: "ci",
                  header: "C.I.",
                  sortable: true,
                },

                {
                  key: "titular",
                  header: "Titular",
                  sortable: true,
                },

                {
                  key: "tipoDocumento",
                  header: "Documento",
                  render: (row) => (
                    <Badge variant="neutral">
                      {formatearTipoDocumento(
                        row.tipoDocumento
                      )}
                    </Badge>
                  ),
                },

                {
                  key: "ubicacion",
                  header: "Ubicación Física",
                  render: (row) => (
                    <Badge variant="warning">
                      {
                        row.ubicacion
                      }
                    </Badge>
                  ),
                },

                {
                  key: "fechaDerivacion",
                  header: "Fecha",
                  sortable: true,
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
                        revisarExpediente(
                          row.expedienteId
                        )
                      }
                    >
                      Revisar
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

export default BovedaHistorica;