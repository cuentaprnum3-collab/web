const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

function normalizeUrl(value) {
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
    return `${normalized.origin}${normalized.pathname.replace(/\/+$/, '')}`;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL);
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

export const CONFIG = {
  API_BASE_URL,
  FRONTEND_URL,
  TOKEN_STORAGE_KEY: 'readtrack_token',
  USER_STORAGE_KEY: 'readtrack_user',
};

export const COLORS_MATERIA = [
  '#7c2a8e',
  '#bed52f',
  '#f97316',
  '#38bdf8',
  '#10b981',
  '#f59e0b',
  '#ec4899',
];

export const THEME = {
  colors: {
    dark: '#29313c',
    purple: '#7c2a8e',
    lime: '#bed52f',
    limeDk: '#9ab022',
    purpleLt: '#9d3db3',
    white: '#fff',
    g100: '#f6f7f8',
    g200: '#eef0f2',
    g300: '#dde0e4',
    g400: '#b0b6be',
    tPrimary: '#1a2030',
    tSecondary: '#5a6372',
    tHint: '#9ba3ad',
  },
};
