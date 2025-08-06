import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("[API Interceptor] A verificar o token...");

    if (token) {
      console.log(
        "[API Interceptor] Token encontrado. A adicionar ao cabeçalho."
      );
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(
        "[API Interceptor] Nenhum token encontrado no localStorage."
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "[API Interceptor] Erro 401 (Não Autorizado). O token pode ser inválido ou ter expirado."
      );
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
