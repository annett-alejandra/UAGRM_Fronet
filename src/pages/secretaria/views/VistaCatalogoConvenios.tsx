import { useState } from "react";
import { useSecretaria } from "../context/useSecretaria";
import { FormularioConvenio } from "../components/convenios/FormularioConvenio";
import { TablaConvenios } from "../components/convenios/TablaConvenios";
import { Button, Input } from "@shared/ui";
import { Handshake, Plus, Search, ListFilter } from "lucide-react";

export function VistaCatalogoConvenios() {
  const { convenios, crearConvenio } = useSecretaria();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const conveniosFiltrados = convenios.filter((c) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      c.razonSocial.toLowerCase().includes(q) ||
      c.numeroConvenio.toLowerCase().includes(q) ||
      c.funcionario.nombreCompleto.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Cabecera Vista 2.4 */}
      <div className="sec-header-action-row">
        <div>
          <div className="sec-toolbar-group">
            <Handshake size={26} className="sec-text-uagrm" />
            <h1 className="sec-view-title">
              Catálogo de Instituciones Afiliadas y Convenios
            </h1>
          </div>
          <p className="sec-view-subtitle">
            Administración y alta de convenios interinstitucionales y emisión del Código Secreto para trámites masivos.
          </p>
        </div>

        <Button
          variant={mostrarFormulario ? "secondary" : "primary"}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? (
            <>
              <ListFilter size={18} />
              <span>Ver Catálogo</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Registrar Nuevo Convenio</span>
            </>
          )}
        </Button>
      </div>

      {/* Formulario de Alta Condicional */}
      {mostrarFormulario ? (
        <div className="sec-mb-6">
          <FormularioConvenio
            onGuardar={(nuevo) => {
              crearConvenio(nuevo);
              setMostrarFormulario(false);
            }}
            onCancelar={() => setMostrarFormulario(false)}
          />
        </div>
      ) : (
        <>
          {/* Barra de Búsqueda de Convenios */}
          <div className="sec-mb-4">
            <Input
              startIcon={<Search size={18} />}
              placeholder="Buscar por Razón Social, Número de Convenio o Funcionario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Tabla de Convenios */}
          <TablaConvenios convenios={conveniosFiltrados} />
        </>
      )}
    </div>
  );
}
