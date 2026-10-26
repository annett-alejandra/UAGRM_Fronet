import * as React from "react";
import { UploadCloud, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@shared/ui";
import { type PostulanteNomina } from "./portal.types";
import { TablaPrevisualizacion } from "./TablaPrevisualizacion";

export interface ModuloCargaNominaProps {
  postulantes: PostulanteNomina[];
  setPostulantes: React.Dispatch<React.SetStateAction<PostulanteNomina[]>>;
}

/**
 * Módulo de Carga Masiva de Nómina para Trámites Institucionales
 * Permite la descarga de plantilla Excel y el procesamiento Drag & Drop en cliente.
 * 0 estilos en línea y consumo de componentes de @shared/ui.
 */
export const ModuloCargaNomina: React.FC<ModuloCargaNominaProps> = ({
  postulantes,
  setPostulantes,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Parseo de archivo Excel / CSV en el navegador
  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
        });

        // Omitir cabecera y filtrar filas vacías
        const rows = jsonData.slice(1).filter((row) => row && row.length > 0);

        const parsedPostulantes: PostulanteNomina[] = rows.map((row) => ({
          ci: row[0] ? String(row[0]).trim() : "",
          nombre: row[1] ? String(row[1]).trim() : "",
          carrera: row[2] ? String(row[2]).trim() : "",
          titulo: row[3] ? String(row[3]).trim() : "",
          gestion: row[4] ? String(row[4]).trim() : "",
        }));

        setPostulantes(parsedPostulantes);
      } catch (error) {
        console.error("Error al procesar el archivo de nómina:", error);
        alert(
          "Ocurrió un error al procesar el archivo. Asegúrese de que sea un archivo Excel válido."
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseExcel(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xls")
      ) {
        parseExcel(file);
      } else {
        alert("Formato no admitido. Suba un archivo en formato .xlsx o .csv.");
      }
    }
  };

  const handleEliminarPostulante = (index: number) => {
    setPostulantes((prev) => prev.filter((_, i) => i !== index));
  };

  // Descarga de plantilla institucional preformateada
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["C.I.", "Nombre Completo", "Carrera", "N° de Título", "Gestión"],
      ["8492019", "Juan Carlos Pérez", "Ingeniería Informática", "TIT-2023-889", "2023"],
      ["6521990", "María Elena Rojas", "Licenciatura en Derecho", "TIT-2022-412", "2022"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nómina_UAGRM");
    XLSX.writeFile(wb, "Plantilla_Nomina_Convenio_UAGRM.xlsx");
  };

  return (
    <section className="portal-section-card">
      <header className="portal-section-header">
        <div className="portal-section-title-wrap">
          <span className="portal-section-step">4</span>
          <div>
            <h3 className="portal-section-title">
              Carga Masiva de Nómina de Postulantes (Convenio)
            </h3>
            <span className="portal-section-caption">
              Suba el archivo de nómina para verificación simultánea de títulos y acreditaciones.
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
        >
          <Download size={16} />
          <span>Descargar Plantilla Excel (.xlsx)</span>
        </Button>
      </header>

      {/* Input de archivo nativo oculto */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        ref={fileInputRef}
        aria-hidden="true"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Zona Drag & Drop */}
      <div
        className={`portal-upload-zone ${isDragging ? "portal-upload-zone--active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <UploadCloud size={44} className="portal-upload-icon" />
        <div className="portal-upload-text">
          Haga clic o arrastre el archivo de nómina aquí (.xlsx o .csv)
        </div>
        <div className="portal-upload-hint">
          La primera fila debe contener los encabezados: C.I., Nombre Completo, Carrera, N°
          de Título, Gestión.
        </div>
      </div>

      {/* Tabla de Previsualización Reactiva */}
      <TablaPrevisualizacion
        postulantes={postulantes}
        onEliminar={handleEliminarPostulante}
      />
    </section>
  );
};

export default ModuloCargaNomina;
