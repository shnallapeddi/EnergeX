import axios from "axios";

const api = axios.create({
  baseURL: "/", // keep relative; the proxy handles /api
});

export default api;

