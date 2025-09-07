// src/lib/api.ts
import axios from 'axios';

const RAW = (import.meta.env.VITE_API_BASE || '').trim();
// Join with /api and strip any trailing slash from RAW
const BASE = RAW ? RAW.replace(/\/$/, '') + '/api' : '/api';

const api = axios.create({
  baseURL: BASE,
  headers: { Accept: 'application/json' },
});

// Optional: keep the auth helper if you use JWT later
export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

// Load any saved token on boot
const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);

export default api;
