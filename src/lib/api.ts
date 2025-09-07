import axios from "axios";

const RAW = (import.meta.env.VITE_API_BASE || "").trim();
const BASE = (RAW ? RAW.replace(/\/+$/, "") : "") + "/api";

export const api = axios.create({
  baseURL: BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);

export default api;
