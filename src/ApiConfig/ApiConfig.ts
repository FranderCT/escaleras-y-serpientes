import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:5089",
  timeout: 5000,
});

// Interceptor request
apiAxios.interceptors.request.use(
  (config: any) => {
    config.headers = config.headers ?? {};

    // ¿Ya viene Authorization? (p. ej. ResetPasswd con token de reset)
    const hasAuthHeader =
      !!config.headers["Authorization"] || !!config.headers["authorization"];

    if (hasAuthHeader) {
      return config; // respeta el header que mandaste en la llamada
    }

    // Si no viene Authorization, usamos el de sesión
    const sessionToken = localStorage.getItem("token");
    if (sessionToken && sessionToken !== "null" && sessionToken !== "undefined") {
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
    } else {
      delete config.headers["Authorization"]; // evita "Bearer null"
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiAxios;
