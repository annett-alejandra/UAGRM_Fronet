import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { ReconstruccionOcrSplitView } from '../../features/reconstruccion-ocr/ReconstruccionOcrSplitView';
import { PlantillaAutenticidad } from '../../features/plantilla-autenticidad/PlantillaAutenticidad';

export function SecretariaLayout() {
  return (
    <SidebarNavWidget pageTitle="Secretaría General - UAGRM">
      <div className="flex flex-col h-full bg-[#0F1524]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="reconstruccion-ocr" replace />} />
            <Route path="reconstruccion-ocr" element={<ReconstruccionOcrSplitView />} />
            <Route path="autenticidad" element={<PlantillaAutenticidad />} />
            <Route path="*" element={<Navigate to="reconstruccion-ocr" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
