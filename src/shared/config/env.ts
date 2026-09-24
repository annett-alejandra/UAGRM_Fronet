interface EnvConfig {
  readonly API_BASE_URL: string;
  readonly GRAPHQL_URL: string;
  readonly MINIO_PUBLIC_URL: string;
  readonly APP_ENV: 'development' | 'production' | 'staging';
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (value !== undefined && value !== '') {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`[env] Variable de entorno "${key}" no está definida y no tiene valor por defecto.`);
}

export const env: EnvConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000/api'),
  GRAPHQL_URL: getEnvVar('VITE_GRAPHQL_URL', 'http://localhost:8000/graphql'),
  MINIO_PUBLIC_URL: getEnvVar('VITE_MINIO_PUBLIC_URL', 'http://localhost:9000'),
  APP_ENV: getEnvVar('VITE_APP_ENV', 'development') as EnvConfig['APP_ENV'],
} as const;
