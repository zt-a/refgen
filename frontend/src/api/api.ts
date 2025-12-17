import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "/api";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const $api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

$api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                const refresh = await axios.get(
                    `${API_BASE_URL}/v1/auth/refresh`,
                    { withCredentials: true }
                );

                localStorage.setItem("access_token", refresh.data.access_token);

                return $api.request(originalRequest);
            } catch (e) {
                console.log("REFRESH FAILED", e);
            }
        }

        throw error;
    }
);
