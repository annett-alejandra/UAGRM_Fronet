import { env } from '../config/env';

interface RestRequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly body?: Record<string, unknown> | FormData;
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
}

interface RestResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly ok: boolean;
}

class RestClientError extends Error {
  readonly status: number;
  readonly responseBody: unknown;

  constructor(message: string, status: number, responseBody: unknown) {
    super(message);
    this.name = 'RestClientError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string } };
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RestRequestOptions = {},
): Promise<RestResponse<T>> {
  const { method = 'GET', body, headers = {}, signal } = options;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${env.API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (body && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include', // <--- Envía las cookies HttpOnly al backend
  });

  let data: T;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = (await response.json()) as T;
  } else {
    data = (await response.text()) as unknown as T;
  }

  if (!response.ok) {
    throw new RestClientError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      data,
    );
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

export const restClient = {
  get<T>(endpoint: string, options?: Omit<RestRequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<RestRequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<RestRequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<RestRequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: Omit<RestRequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /** Upload a file directly to a presigned MinIO URL */
  async uploadToPresignedUrl(
    presignedUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new RestClientError(
            `Upload failed: HTTP ${xhr.status}`,
            xhr.status,
            xhr.responseText,
          ));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new RestClientError('Upload network error', 0, null));
      });

      xhr.send(file);
    });
  },
} as const;

export { RestClientError };
export type { RestResponse, RestRequestOptions };

