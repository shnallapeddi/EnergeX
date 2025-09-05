import axios from 'axios';

const api = axios.create({
  // requests to /api/* are going to be forwarded to http://localhost:8000
  baseURL: '/',
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);

export default api;

