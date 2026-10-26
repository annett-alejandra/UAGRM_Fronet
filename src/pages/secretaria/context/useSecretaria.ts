import { useContext } from "react";
import { SecretariaContext } from "./SecretariaContext";
import type { SecretariaContextType } from "../types/secretaria.types";

export function useSecretaria(): SecretariaContextType {
  const ctx = useContext(SecretariaContext);
  if (!ctx) {
    throw new Error("useSecretaria debe usarse dentro de un SecretariaProvider");
  }
  return ctx;
}
