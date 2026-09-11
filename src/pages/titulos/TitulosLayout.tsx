import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { BusquedaGlobalTitulos } from '../../features/titulos/BusquedaGlobalTitulos';
import { VisorExpedienteDigital } from '../../features/titulos/VisorExpedienteDigital';
import { EmisionPlantillas } from '../../features/titulos/EmisionPlantillas';
import { CargaLibrosMatrices } from '../../features/titulos/CargaLibrosMatrices';

export function TitulosLayout() {
  return (
    <SidebarNavWidget pageTitle="Departamento de Títulos y Grados - UAGRM">
      <div className="flex flex-col h-full bg-[#0F1524]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="busqueda" replace />} />
            <Route path="busqueda" element={<BusquedaGlobalTitulos />} />
            <Route path="expediente/:id" element={<VisorExpedienteDigital />} />
            <Route path="emision" element={<EmisionPlantillas />} />
            <Route path="carga-libros" element={<CargaLibrosMatrices />} />
            <Route path="*" element={<Navigate to="busqueda" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
