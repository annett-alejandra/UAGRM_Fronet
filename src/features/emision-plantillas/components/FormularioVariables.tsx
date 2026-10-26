// src/views/VistaEmisionPlantillas/components/FormularioVariables.tsx
import * as React from "react";
import { 
  FileEdit, 
  User, 
  BookOpen, 
  Calendar, 
  ShieldAlert, 
  Scale, 
  CheckCircle2,
  Highlighter
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { ModoDocumento } from "@/shared/ui";
import type { 
  DatosCertificadoAutenticidad, 
  DatosSupletorioAnverso, 
  DatosProvidenciaReverso, 
  DatosInformeArchivo 
} from "@/shared/types/plantillas.types";

export interface FormularioVariablesProps {
  modo: ModoDocumento;
  datosCertificado: DatosCertificadoAutenticidad;
  onChangeCertificado: (datos: DatosCertificadoAutenticidad) => void;
  datosSupletorio: DatosSupletorioAnverso;
  onChangeSupletorio: (datos: DatosSupletorioAnverso) => void;
  datosProvidencia: DatosProvidenciaReverso;
  onChangeProvidencia: (datos: DatosProvidenciaReverso) => void;
  datosInforme: DatosInformeArchivo;
  onChangeInforme: (datos: DatosInformeArchivo) => void;
  resaltarVariables: boolean;
  onToggleResaltarVariables: () => void;
}

export const FormularioVariables: React.FC<FormularioVariablesProps> = ({
  modo,
  datosCertificado,
  onChangeCertificado,
  datosSupletorio,
  onChangeSupletorio,
  datosProvidencia,
  onChangeProvidencia,
  datosInforme,
  onChangeInforme,
  resaltarVariables,
  onToggleResaltarVariables
}) => {
  // Manejadores genéricos
  const handleCertChange = (campo: keyof DatosCertificadoAutenticidad, valor: any) => {
    onChangeCertificado({ ...datosCertificado, [campo]: valor });
  };

  const handleSupletorioChange = (campo: keyof DatosSupletorioAnverso, valor: any) => {
    onChangeSupletorio({ ...datosSupletorio, [campo]: valor });
  };

  const handleProvidenciaChange = (campo: keyof DatosProvidenciaReverso, valor: any) => {
    onChangeProvidencia({ ...datosProvidencia, [campo]: valor });
  };

  const handleInformeChange = (campo: keyof DatosInformeArchivo, valor: any) => {
    onChangeInforme({ ...datosInforme, [campo]: valor });
  };

  const handleTablaCustodiaChange = (campo: string, valor: string) => {
    onChangeInforme({
      ...datosInforme,
      tablaCustodia: {
        ...datosInforme.tablaCustodia,
        [campo]: valor
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Barra de utilidades del formulario */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <FileEdit className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">
            Editor de Variables Dinámicas (Folios UAGRM)
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleResaltarVariables}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
            resaltarVariables
              ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
          }`}
          title="Resalta con fondo de color las variables dinámicas dentro del texto legal"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>{resaltarVariables ? "Variables Resaltadas" : "Resaltar Variables"}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. FORMULARIO PARA CERTIFICADOS DE AUTENTICIDAD */}
      {/* ============================================================== */}
      {modo.categoria === "CERTIFICADOS" && (
        <div className="space-y-4">
          {/* Sección 1: Datos Administrativos de Emisión */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-blue-400">
                <Calendar className="w-4 h-4" />
                <span>1. Datos del Certificado e Informe de Archivo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° de Certificado (ej. 117/2026):
                  </label>
                  <Input
                    value={datosCertificado.nroCertificado}
                    onChange={(e) => handleCertChange("nroCertificado", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Emisión Certificado:
                  </label>
                  <Input
                    value={datosCertificado.fechaEmisionCertificado}
                    onChange={(e) => handleCertChange("fechaEmisionCertificado", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Informe Archivo (ej. N°094, N°472):
                  </label>
                  <Input
                    value={datosCertificado.nroInformeArchivo}
                    onChange={(e) => handleCertChange("nroInformeArchivo", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Informe Archivo:
                  </label>
                  <Input
                    value={datosCertificado.fechaInformeArchivo}
                    onChange={(e) => handleCertChange("fechaInformeArchivo", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 2: Datos del Titular y Documento Académico */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-indigo-400">
                <User className="w-4 h-4" />
                <span>2. Titular y Registro en Libros Matrices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Condición y Nombre Completo (ej. al ciudadano GUALBERTO MEDINA VARGAS):
                </label>
                <Input
                  value={datosCertificado.condicionCiudadanoYNombre}
                  onChange={(e) => handleCertChange("condicionCiudadanoYNombre", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Cédula de Identidad (ej. N°8072900-SCZ.):
                  </label>
                  <Input
                    value={datosCertificado.ciTitular}
                    onChange={(e) => handleCertChange("ciTitular", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° de Título / Diploma (ej. N°96071):
                  </label>
                  <Input
                    value={datosCertificado.nroTitulo}
                    onChange={(e) => handleCertChange("nroTitulo", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Tipo y Nombre del Título (ej. Título en Provisión Nacional de MÉDICO CIRUJANO):
                </label>
                <Input
                  value={datosCertificado.tipoYNombreTitulo}
                  onChange={(e) => handleCertChange("tipoYNombreTitulo", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Libro (ej. N°0017):
                  </label>
                  <Input
                    value={datosCertificado.nroLibro}
                    onChange={(e) => handleCertChange("nroLibro", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Fojas (ej. N°0027):
                  </label>
                  <Input
                    value={datosCertificado.nroFojas}
                    onChange={(e) => handleCertChange("nroFojas", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Emisión Título:
                  </label>
                  <Input
                    value={datosCertificado.fechaEmisionTitulo}
                    onChange={(e) => handleCertChange("fechaEmisionTitulo", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 3: Cláusulas Especiales Condicionales por Tipo */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
                <span>3. Cláusulas Condicionales ({modo.subtipo})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Cláusula Aclaratoria de Firma Histórica <= 1999 */}
              {(modo.subtipo === "TIPO_2" || modo.subtipo === "TIPO_3" || modo.subtipo === "TIPO_4_5_B") && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-xs font-semibold text-amber-300 block mb-1">
                    Aclaratoria de Pie de Firma Histórica (Libros Matrices ≤ 1999)
                  </span>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Año de Gestión Universitaria (ej. 1999, 1998):
                  </label>
                  <Input
                    value={datosCertificado.anioGestion || ""}
                    onChange={(e) => handleCertChange("anioGestion", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              )}

              {/* Cláusula Legitimación Rectoral Res. CEU (Tipo 4_A) */}
              {modo.subtipo === "TIPO_4_A" && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-amber-300 block">
                    Legitimación Rectoral y Resolución C.E.U. (Pág. 6)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block">N° Res. C.E.U.:</label>
                      <Input
                        value={datosCertificado.nroResolucionCeu || ""}
                        onChange={(e) => handleCertChange("nroResolucionCeu", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">Fecha Res. C.E.U.:</label>
                      <Input
                        value={datosCertificado.fechaResolucionCeu || ""}
                        onChange={(e) => handleCertChange("fechaResolucionCeu", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block">Rector Original (ej. Lic. Alfredo Jaldín):</label>
                      <Input
                        value={datosCertificado.rectorGestionOriginal || ""}
                        onChange={(e) => handleCertChange("rectorGestionOriginal", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">Año Emisión Original (ej. 2007):</label>
                      <Input
                        value={datosCertificado.anioGestionOriginal || ""}
                        onChange={(e) => handleCertChange("anioGestionOriginal", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block">Rector Actual (ej. Dr. Reinerio Vargas):</label>
                      <Input
                        value={datosCertificado.rectorActual || ""}
                        onChange={(e) => handleCertChange("rectorActual", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">Gestión Actual (ej. 2025-2029):</label>
                      <Input
                        value={datosCertificado.periodoGestionActual || ""}
                        onChange={(e) => handleCertChange("periodoGestionActual", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cláusula Supletorio Previo (Tipo 3 y Tipo 4_5_B) */}
              {(modo.subtipo === "TIPO_3" || modo.subtipo === "TIPO_4_5_B") && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-indigo-300 block">
                    Antecedente de Supletorio Previo (Págs. 2 y 8)
                  </span>
                  <div>
                    <label className="text-[11px] text-slate-400 block">Tipo y N° Supletorio:</label>
                    <Input
                      value={datosCertificado.tipoYNroSupletorio || ""}
                      onChange={(e) => handleCertChange("tipoYNroSupletorio", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block">Fecha Literal Supletorio:</label>
                    <Input
                      value={datosCertificado.fechaLiteralSupletorio || ""}
                      onChange={(e) => handleCertChange("fechaLiteralSupletorio", e.target.value)}
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block">Secretario Firmante:</label>
                      <Input
                        value={datosCertificado.secretarioGeneralFirmante || ""}
                        onChange={(e) => handleCertChange("secretarioGeneralFirmante", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">Rector Firmante:</label>
                      <Input
                        value={datosCertificado.rectorFirmante || ""}
                        onChange={(e) => handleCertChange("rectorFirmante", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cláusula Rectificación en Reverso (Tipo 4_5_B) */}
              {modo.subtipo === "TIPO_4_5_B" && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-emerald-300 block">
                    Rectificación y Enmienda al Reverso (Pág. 8)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block">Fecha Providencia:</label>
                      <Input
                        value={datosCertificado.fechaAclarativaReverso || ""}
                        onChange={(e) => handleCertChange("fechaAclarativaReverso", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">Nombre Rectificado:</label>
                      <Input
                        value={datosCertificado.nombreRectificado || ""}
                        onChange={(e) => handleCertChange("nombreRectificado", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block">C.I. Rectificado:</label>
                      <Input
                        value={datosCertificado.ciRectificado || ""}
                        onChange={(e) => handleCertChange("ciRectificado", e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FORMULARIO PARA TÍTULOS SUPLETORIOS (ANVERSO) */}
      {/* ============================================================== */}
      {modo.categoria === "SUPLETORIOS" && modo.seccion === "ANVERSO" && (
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-indigo-400">
                <BookOpen className="w-4 h-4" />
                <span>1. Datos del Título Supletorio ({datosSupletorio.subtipo})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Subtítulo Oficial:
                  </label>
                  <Input
                    value={datosSupletorio.subtituloSupletorio}
                    onChange={(e) => handleSupletorioChange("subtituloSupletorio", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Documento Supletorio:
                  </label>
                  <Input
                    value={datosSupletorio.nroDocumento}
                    onChange={(e) => handleSupletorioChange("nroDocumento", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Nombre Completo del Titular:
                </label>
                <Input
                  value={datosSupletorio.nombreTitular}
                  onChange={(e) => handleSupletorioChange("nombreTitular", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Cédula de Identidad:
                  </label>
                  <Input
                    value={datosSupletorio.ciTitular}
                    onChange={(e) => handleSupletorioChange("ciTitular", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Lugar de Nacimiento:
                  </label>
                  <Input
                    value={datosSupletorio.lugarNacimiento}
                    onChange={(e) => handleSupletorioChange("lugarNacimiento", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Grado / Diploma / Profesión:
                </label>
                <Input
                  value={datosSupletorio.gradoDiplomaOProfesion}
                  onChange={(e) => handleSupletorioChange("gradoDiplomaOProfesion", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Libro Original:
                  </label>
                  <Input
                    value={datosSupletorio.nroLibro}
                    onChange={(e) => handleSupletorioChange("nroLibro", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fojas Original:
                  </label>
                  <Input
                    value={datosSupletorio.nroFojas}
                    onChange={(e) => handleSupletorioChange("nroFojas", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Autorización:
                  </label>
                  <Input
                    value={datosSupletorio.fechaAutorizacionOriginal}
                    onChange={(e) => handleSupletorioChange("fechaAutorizacionOriginal", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Día Literal:
                  </label>
                  <Input
                    value={datosSupletorio.diaLiteral}
                    onChange={(e) => handleSupletorioChange("diaLiteral", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Mes Literal:
                  </label>
                  <Input
                    value={datosSupletorio.mesLiteral}
                    onChange={(e) => handleSupletorioChange("mesLiteral", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Año Literal:
                  </label>
                  <Input
                    value={datosSupletorio.anioLiteral}
                    onChange={(e) => handleSupletorioChange("anioLiteral", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FORMULARIO PARA PROVIDENCIAS RECTIFICATORIAS (REVERSO) */}
      {/* ============================================================== */}
      {modo.categoria === "SUPLETORIOS" && modo.seccion === "REVERSO" && (
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-amber-400">
                <Scale className="w-4 h-4" />
                <span>1. Providencia Rectificatoria Legal ({datosProvidencia.subtipo})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Providencia:
                  </label>
                  <Input
                    value={datosProvidencia.fechaProvidencia}
                    onChange={(e) => handleProvidenciaChange("fechaProvidencia", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Cert. Nacimiento:
                  </label>
                  <Input
                    value={datosProvidencia.nroCertNacimiento}
                    onChange={(e) => handleProvidenciaChange("nroCertNacimiento", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Oficialía SERECI:
                  </label>
                  <Input
                    value={datosProvidencia.nroOficialiaSereci}
                    onChange={(e) => handleProvidenciaChange("nroOficialiaSereci", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Informe Archivo:
                  </label>
                  <Input
                    value={datosProvidencia.nroInfArchivo}
                    onChange={(e) => handleProvidenciaChange("nroInfArchivo", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              {datosProvidencia.subtipo === "RECTIFICACION_NOMBRE" ? (
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Partida SERECI:
                  </label>
                  <Input
                    value={datosProvidencia.nroPartidaSereci || ""}
                    onChange={(e) => handleProvidenciaChange("nroPartidaSereci", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      N° Res. SEGIP:
                    </label>
                    <Input
                      value={datosProvidencia.nroResSegip || ""}
                      onChange={(e) => handleProvidenciaChange("nroResSegip", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Fecha Res. SEGIP:
                    </label>
                    <Input
                      value={datosProvidencia.fechaResSegip || ""}
                      onChange={(e) => handleProvidenciaChange("fechaResSegip", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Informe Legal Asesoría Jurídica:
                  </label>
                  <Input
                    value={datosProvidencia.nroInformeLegal}
                    onChange={(e) => handleProvidenciaChange("nroInformeLegal", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Informe Legal:
                  </label>
                  <Input
                    value={datosProvidencia.fechaInformeLegal}
                    onChange={(e) => handleProvidenciaChange("fechaInformeLegal", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Referencia de Supletorio:
                </label>
                <Input
                  value={datosProvidencia.tipoYNroSupletorioReferencia}
                  onChange={(e) => handleProvidenciaChange("tipoYNroSupletorioReferencia", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Nombre Rectificado Definitivo:
                  </label>
                  <Input
                    value={datosProvidencia.nombreFinalRectificado}
                    onChange={(e) => handleProvidenciaChange("nombreFinalRectificado", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    C.I. Definitivo:
                  </label>
                  <Input
                    value={datosProvidencia.ciFinalRectificado}
                    onChange={(e) => handleProvidenciaChange("ciFinalRectificado", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. FORMULARIO PARA INFORMES ARCHIVO CENTRAL (9 COLUMNAS) */}
      {/* ============================================================== */}
      {modo.categoria === "INFORMES" && (
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span>1. Datos del Informe y Solicitud</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    N° Informe Archivo:
                  </label>
                  <Input
                    value={datosInforme.nroInforme}
                    onChange={(e) => handleInformeChange("nroInforme", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Informe:
                  </label>
                  <Input
                    value={datosInforme.fechaInforme}
                    onChange={(e) => handleInformeChange("fechaInforme", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Fecha Solicitud:
                  </label>
                  <Input
                    value={datosInforme.fechaSolicitud}
                    onChange={(e) => handleInformeChange("fechaSolicitud", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Referencia Diploma:
                  </label>
                  <Input
                    value={datosInforme.tipoDiplomaReferencia}
                    onChange={(e) => handleInformeChange("tipoDiplomaReferencia", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Custodia 9 Columnas */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-semibold flex items-center space-x-2 text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Fila de Registro Fidedigno (9 Columnas)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block">N° Diploma:</label>
                  <Input
                    value={datosInforme.tablaCustodia.nroDiploma}
                    onChange={(e) => handleTablaCustodiaChange("nroDiploma", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-400 block">Nombre Completo:</label>
                  <Input
                    value={datosInforme.tablaCustodia.nombreApellidos}
                    onChange={(e) => handleTablaCustodiaChange("nombreApellidos", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block">C.I.:</label>
                  <Input
                    value={datosInforme.tablaCustodia.ciTitular}
                    onChange={(e) => handleTablaCustodiaChange("ciTitular", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">Libro:</label>
                  <Input
                    value={datosInforme.tablaCustodia.libro}
                    onChange={(e) => handleTablaCustodiaChange("libro", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">Fojas:</label>
                  <Input
                    value={datosInforme.tablaCustodia.fojas}
                    onChange={(e) => handleTablaCustodiaChange("fojas", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block">Rector de la Época:</label>
                  <Input
                    value={datosInforme.tablaCustodia.nombreRector}
                    onChange={(e) => handleTablaCustodiaChange("nombreRector", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">Pie de Firma Rector:</label>
                  <Input
                    value={datosInforme.tablaCustodia.pieFirmaRector}
                    onChange={(e) => handleTablaCustodiaChange("pieFirmaRector", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100 text-xs h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
