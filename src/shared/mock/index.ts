// src/shared/mock/index.ts
import mockDataJson from "./mock_data.json";
import casosRealesJson from "./casos_reales_folios.json";

export interface MockDataDataset {
  tramites: any[];
  documentos: any[];
  graduados: any[];
  informes: any[];
  titulos: any[];
}

export const MOCK_DATASET = mockDataJson;
export const MOCK_CASOS_REALES = casosRealesJson;

/**
 * Indicador de Modo Autónomo (Mock Data activo)
 * Permite al frontend operar al 100% sin conexión a motores PostgreSQL o IBM Informix
 */
export const IS_MOCK_ENV = true;

export default {
  dataset: MOCK_DATASET,
  casosReales: MOCK_CASOS_REALES,
  isMock: IS_MOCK_ENV,
};
