import axios from "axios"
import { parseCookies } from 'nookies'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const cookies = parseCookies()
      const token = cookies.jwt
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Comentado temporariamente para desativar proteção de rotas
    // if (error.response && error.response.status === 401) {
    //   if (typeof window !== "undefined") {
    //     const currentPath = window.location.pathname;
    //     const allowedPaths = ['/login', '/register', '/plans'];
    //     
    //     if (!allowedPaths.includes(currentPath)) {
    //       document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    //       window.location.href = "/login";
    //     }
    //   }
    // }
    return Promise.reject(error);
  }
);