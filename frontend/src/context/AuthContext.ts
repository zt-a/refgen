import { createContext } from "react";


export interface User {
    id: number;
    email: string;
    username: string;
    balance: number;
    is_active: boolean;
    is_verified: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    name: string;
    surname: string;
    patronymic?: string | null;
    university?: string | null;
    faculty?: string | null;
    course?: number | null;
    group?: string | null;
    city?: string | null;
    phone_number?: string | null;
    avatar_url?: string | null;
    user_id: number;
    updated_at: string;
}

export interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isAuth: boolean;
    register: (data: { username: string; email: string; password: string }) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getProfile: () => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isAuth: false,
    register: async () => {},
    login: async () => {},
    logout: async () => {},
    getProfile: async () => {},
    updateProfile: async () => {}
});
