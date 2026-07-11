import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Intercepta todas as requisições e adiciona o token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta respostas: em 401 (token expirado/inválido), limpa o token
// e redireciona para o login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/Login") {
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
