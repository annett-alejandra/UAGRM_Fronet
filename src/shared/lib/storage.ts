/** Type-safe wrapper around localStorage with JSON serialization */

export function getStorageItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Error al guardar "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}

/** Type-safe wrapper around sessionStorage */
export function getSessionItem<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setSessionItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[session] Error al guardar "${key}":`, error);
  }
}
