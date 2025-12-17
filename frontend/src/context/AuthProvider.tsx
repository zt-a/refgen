import { useEffect, useState } from "react";
import { $api } from "../api/api";
import { AuthContext } from "./AuthContext";
import type { Profile, User } from './AuthContext';
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const me = await $api.get("/api/v1/auth/current_user");
                setUser(me.data);
                setIsAuth(true);

                // Получаем профиль после успешного получения пользователя
                await getProfile();
            } catch (e) {
                console.log("Ошибка при получении текущего пользователя:", e);
                setUser(null);
                setProfile(null);
                setIsAuth(false);
            }
        })();
    }, []);

    const register = async (data: { username: string; email: string; password: string }) => {
        try {
            const res = await $api.post("/api/v1/auth/register", data);
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            setIsAuth(true);
            await getProfile();
            navigate("/dashboard");
        } catch (e) {
            console.log("Ошибка регистрации:", e);
            throw e;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await $api.post("/api/v1/auth/login", { email, password });
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            setIsAuth(true);
            await getProfile();
            navigate("/dashboard");
        } catch (e) {
            console.log("Ошибка авторизации:", e);
            throw e;
        }
    };

    const logout = async () => {
        try {
            await $api.get("/api/v1/auth/logout", { withCredentials: true });
        } catch (e) {
            console.log("Ошибка logout:", e);
        } finally {
            localStorage.removeItem("access_token");
            setUser(null);
            setProfile(null);
            setIsAuth(false);
            navigate("/login");
        }
    };

    const getProfile = async () => {
        try {
            const res = await $api.get("/api/v1/profile/me");
            setProfile(res.data);
        } catch (e) {
            console.log("Ошибка получения профиля:", e);
            setProfile(null);
        }
    };

    const updateProfile = async (data: Partial<Profile>) => {
        try {
            const res = await $api.put("/api/v1/profile/", data);
            setProfile(res.data);
        } catch (e) {
            console.log("Ошибка обновления профиля:", e);
            throw e;
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, isAuth, register, login, logout, getProfile, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};