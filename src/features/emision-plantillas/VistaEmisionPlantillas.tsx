// src/views/VistaEmisionPlantillas/VistaEmisionPlantillas.tsx
import * as React from "react";
import { 
  DocumentViewer, 
  TemplateSelector, 
  type ModoDocumento 
} from "@/shared/ui";
import { FormularioVariables } from "./components/FormularioVariables";
import { PlantillaCertificado } from "./components/PlantillaCertificado";
import { PlantillaSupletorioAnverso } from "./components/PlantillaSupletorioAnverso";
import { PlantillaProvidenciaReverso } from "./components/PlantillaProvidenciaReverso";
import { PlantillaInformeArchivo } from "./components/PlantillaInformeArchivo";
import type { 
  DatosCertificadoAutenticidad, 
  DatosSupletorioAnverso, 
  DatosProvidenciaReverso, 
  DatosInformeArchivo 
} from "@/shared/types/plantillas.types";
import casosData from "@/shared/mock/casos_reales_folios.json";

export const VistaEmisionPlantillas: React.FC = () => {
  // Estado de modo de documento activo
  const [modo, setModo] = React.useState<ModoDocumento>({
    categoria: "CERTIFICADOS",
    subtipo: "TIPO_1"
  });

  // Resaltado de variables dinámicas
  const [resaltarVariables, setResaltarVariables] = React.useState<boolean>(false);

  // Estados de datos de cada categoría
  const [certificados, setCertificados] = React.useState<DatosCertificadoAutenticidad[]>(
    casosData.certificados as unknown as DatosCertificadoAutenticidad[]
  );
  const [certificadoActivo, setCertificadoActivo] = React.useState<DatosCertificadoAutenticidad>(
    certificados[0]
  );

  const [supletorios, setSupletorios] = React.useState<DatosSupletorioAnverso[]>(
    casosData.supletoriosAnverso as unknown as DatosSupletorioAnverso[]
  );
  const [supletorioActivo, setSupletorioActivo] = React.useState<DatosSupletorioAnverso>(
    supletorios[0]
  );

  const [providencias, setProvidencias] = React.useState<DatosProvidenciaReverso[]>(
    casosData.providenciasReverso as unknown as DatosProvidenciaReverso[]
  );
  const [providenciaActiva, setProvidenciaActiva] = React.useState<DatosProvidenciaReverso>(
    providencias[0]
  );

  const [informes, setInformes] = React.useState<DatosInformeArchivo[]>(
    casosData.informesArchivo as unknown as DatosInformeArchivo[]
  );
  const [informeActivo, setInformeActivo] = React.useState<DatosInformeArchivo>(
    informes[0]
  );

  // Carga rápida de casos reales basados en los 13 folios
  const handleCargarCasoReal = (idCaso: string) => {
    // 1. Buscar en certificados
    const cert = certificados.find((c) => c.id === idCaso);
    if (cert) {
      setCertificadoActivo(cert);
      setModo({ categoria: "CERTIFICADOS", subtipo: cert.subtipo });
      return;
    }

    // 2. Casos especiales para supletorios / providencias
    if (idCaso === "caso-5-tipo-45b") {
      const supl = supletorios.find((s) => s.id === "caso-5-supletorio-anverso");
      if (supl) setSupletorioActivo(supl);
      const prov = providencias.find((p) => p.id === "caso-5-providencia-reverso-sereci");
      if (prov) setProvidenciaActiva(prov);
      setModo({ categoria: "SUPLETORIOS", seccion: "ANVERSO", subtipo: "BACHILLER" });
      return;
    }
  };

  // Al cambiar subtipo desde el selector, sincronizar el registro activo
  const handleSelectModo = (nuevoModo: ModoDocumento) => {
    setModo(nuevoModo);

    if (nuevoModo.categoria === "CERTIFICADOS") {
      const match = certificados.find((c) => c.subtipo === nuevoModo.subtipo);
      if (match) {
        setCertificadoActivo(match);
      } else {
        setCertificadoActivo((prev) => ({ ...prev, subtipo: nuevoModo.subtipo }));
      }
    } else if (nuevoModo.categoria === "SUPLETORIOS") {
      if (nuevoModo.seccion === "ANVERSO") {
        const match = supletorios.find((s) => s.subtipo === nuevoModo.subtipo);
        if (match) setSupletorioActivo(match);
      } else {
        const match = providencias.find((p) => p.subtipo === nuevoModo.subtipo);
        if (match) setProvidenciaActiva(match);
      }
    } else if (nuevoModo.categoria === "INFORMES") {
      if (informes.length > 0) {
        setInformeActivo(informes[0]);
      }
    }
  };

  // Metadatos para el DocumentViewer
  const getDocViewerMetadata = () => {
    if (modo.categoria === "CERTIFICADOS") {
      return {
        titulo: `Certificado de Autenticidad (${certificadoActivo.subtipo})`,
        subtitulo: `Secretaría General UAGRM — Titular: ${certificadoActivo.condicionCiudadanoYNombre}`,
        codigoDocumento: `CERT-${certificadoActivo.nroCertificado}`,
        estadoBadge: "Fiel Copia de Matriz",
        varianteBadge: "success" as const
      };
    } else if (modo.categoria === "SUPLETORIOS") {
      if (modo.seccion === "ANVERSO") {
        return {
          titulo: `Título Supletorio Anverso (${supletorioActivo.subtipo})`,
          subtitulo: `Rectorado UAGRM — Titular: ${supletorioActivo.nombreTitular}`,
          codigoDocumento: `SUPL-${supletorioActivo.nroDocumento}`,
          estadoBadge: "Constitucional Oficial",
          varianteBadge: "success" as const
        };
      } else {
        return {
          titulo: `Providencia Rectificatoria Reverso (${providenciaActiva.subtipo})`,
          subtitulo: `Dirección de Asesoría Jurídica — ${providenciaActiva.nombreFinalRectificado}`,
          codigoDocumento: `INF-LEGAL-${providenciaActiva.nroInformeLegal}`,
          estadoBadge: "Resolución Firme",
          varianteBadge: "warning" as const
        };
      }
    } else {
      return {
        titulo: `Informe Técnico de Custodia Documental`,
        subtitulo: `Archivo Central UAGRM — Cotejo de Libros Matrices`,
        codigoDocumento: informeActivo.nroInforme,
        estadoBadge: "Custodia Fidedigna",
        varianteBadge: "neutral" as const
      };
    }
  };

  const meta = getDocViewerMetadata();

  return (
    <div className="space-y-6">
      {/* Selector de Plantilla y Casos Reales */}
      <TemplateSelector
        modoSeleccionado={modo}
        onSelectModo={handleSelectModo}
        onCargarCasoReal={handleCargarCasoReal}
      />

      {/* Disposición Split-Screen 50% / 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (50%): Formulario Editor de Variables */}
        <section className="lg:col-span-5 xl:col-span-5 h-[800px] overflow-y-auto pr-1">
          <FormularioVariables
            modo={modo}
            datosCertificado={certificadoActivo}
            onChangeCertificado={setCertificadoActivo}
            datosSupletorio={supletorioActivo}
            onChangeSupletorio={setSupletorioActivo}
            datosProvidencia={providenciaActiva}
            onChangeProvidencia={setProvidenciaActiva}
            datosInforme={informeActivo}
            onChangeInforme={setInformeActivo}
            resaltarVariables={resaltarVariables}
            onToggleResaltarVariables={() => setResaltarVariables((v) => !v)}
          />
        </section>

        {/* Columna Derecha (50%): Visor A4 con Margen de 4cm e Impresión */}
        <section className="lg:col-span-7 xl:col-span-7 h-[800px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <DocumentViewer
            titulo={meta.titulo}
            subtitulo={meta.subtitulo}
            codigoDocumento={meta.codigoDocumento}
            estadoBadge={meta.estadoBadge}
            varianteBadge={meta.varianteBadge}
            tamanoInicial="A4"
            mostrarGuiaEncuadernacionPorDefecto={false}
          >
            {modo.categoria === "CERTIFICADOS" && (
              <PlantillaCertificado
                datos={certificadoActivo}
                resaltarVariables={resaltarVariables}
              />
            )}

            {modo.categoria === "SUPLETORIOS" && modo.seccion === "ANVERSO" && (
              <PlantillaSupletorioAnverso
                datos={supletorioActivo}
                resaltarVariables={resaltarVariables}
              />
            )}

            {modo.categoria === "SUPLETORIOS" && modo.seccion === "REVERSO" && (
              <PlantillaProvidenciaReverso
                datos={providenciaActiva}
                resaltarVariables={resaltarVariables}
              />
            )}

            {modo.categoria === "INFORMES" && (
              <PlantillaInformeArchivo
                datos={informeActivo}
                resaltarVariables={resaltarVariables}
              />
            )}
          </DocumentViewer>
        </section>
      </div>
    </div>
  );
};
export default VistaEmisionPlantillas;
