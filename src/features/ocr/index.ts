/**
 * Public API Contract: Feature OCR (Feature-Sliced Design)
 * Sistema de Gestión de Títulos Supletorios, Archivo Central y Certificaciones — UAGRM
 */

// Modelos y Tipos
export type {
  DocumentoOcrStatus,
  BoundingBox,
  CampoOcrExtraido,
  RespuestaOcrDinamico,
  PresignUploadRequest,
  PresignUploadResponse,
  DocumentCreateRequest,
  DocumentResponse,
  ConfirmacionOcrPayload,
} from './model/types';

// Constantes y Utilidades de Mapeo
export {
  UMBRAL_CONFIANZA_ALTA,
  UMBRAL_CONFIANZA_MEDIA,
  LABELS_CAMPOS_OCR,
  getLabelCampoOcr,
} from './model/constants';

// Cliente y Servicios API
export { ocrApi } from './api/ocrApi';

// Componentes UI Oficiales
export { CargadorOcrWizard } from './ui/CargadorOcrWizard';
export { PantallaVerificacionOcr } from './ui/PantallaVerificacionOcr';
export { VisorOcrSplitView } from './ui/VisorOcrSplitView';
export { FormularioCamposOcr } from './ui/FormularioCamposOcr';
