import Cookies from "js-cookie";
import axios from "axios";

const token = Cookies.get("user-auth");

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-api.com'
        : 'http://localhost:3000/',
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config: any) => {
    const currentToken = Cookies.get("user-auth");
    if (currentToken) {
        config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
});

api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const err = error.response;
        if (err && err.status === 401) {
            // Token expirado ou inválido
            if (window.location.pathname !== "/") {
                Cookies.remove("user-auth");
                Cookies.remove("user-area");
                window.location.replace("/");
            }
        }
        return Promise.reject(error);
    }
);

export default api;