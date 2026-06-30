import { CONFIG } from '../config';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

function normalizeBaseUrl(value) {
  let url = String(value ?? '').trim();
  if (!url) return DEFAULT_API_BASE_URL;
  if (url.startsWith(':')) {
    url = `http://localhost${url}`;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  try {
    const normalized = new URL(url);
    return normalized.origin + normalized.pathname.replace(/\/+$|$/, '');
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

function buildUrl(baseURL, endpoint) {
  const normalizedBase = normalizeBaseUrl(baseURL).replace(/\/+$/, '');
  const trimmedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${normalizedBase}/${trimmedEndpoint}`;
}

class ApiService {
  constructor() {
    this.baseURL = normalizeBaseUrl(CONFIG.API_BASE_URL);
    if (this.baseURL.startsWith(':')) {
      this.baseURL = DEFAULT_API_BASE_URL;
    }
  }

  getToken() {
    return localStorage.getItem(CONFIG.TOKEN_STORAGE_KEY);
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(method, endpoint, data = null, includeAuth = true) {
    const url = buildUrl(this.baseURL, endpoint);
    const options = {
      method,
      headers: this.getHeaders(includeAuth),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      let requestUrl = url;
      if (requestUrl.startsWith(':')) {
        requestUrl = buildUrl(DEFAULT_API_BASE_URL, endpoint);
        console.warn('Normalized invalid API URL fallback:', url, '->', requestUrl);
      }
      const response = await fetch(requestUrl, options);
      const json = await response.json();

      if (!response.ok) {
        const error = new Error(json.mensaje || 'Error en la solicitud');
        error.status = response.status;
        error.data = json;
        throw error;
      }

      return { ...json, data: json.datos ?? json };
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request('GET', endpoint);
  }

  post(endpoint, data, includeAuth = true) {
    return this.request('POST', endpoint, data, includeAuth);
  }

  put(endpoint, data, includeAuth = true) {
    return this.request('PUT', endpoint, data, includeAuth);
  }

  patch(endpoint, data, includeAuth = true) {
    return this.request('PATCH', endpoint, data, includeAuth);
  }

  delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  async postFormData(endpoint, formData) {
    const url = buildUrl(this.baseURL, endpoint);
    const headers = {};
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) {
        const error = new Error(json.mensaje || 'Error en la solicitud');
        error.status = response.status;
        error.data = json;
        throw error;
      }
      return { ...json, data: json.datos ?? json };
    } catch (error) {
      console.error(`API Error [POST ${endpoint}] (FormData):`, error, '| mensaje del backend:', error.data?.mensaje);
      throw error;
    }
  }
}

export const apiService = new ApiService();
