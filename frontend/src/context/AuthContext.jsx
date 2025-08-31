import React, { createContext, useState } from "react";
import { login as loginApi, signup as signupApi } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    const login = async (email, password) => {
        const res = await loginApi({ email, password });

        // res already has { token, role, userId, name, email }
        const u = {
            token: res.token,
            id: res.userId,
            email: res.email,
            role: res.role,
            name: res.name,
        };

        // Save user + token
        localStorage.setItem("user", JSON.stringify(u));
        localStorage.setItem("token", u.token);   //  so axios interceptor works
        localStorage.setItem("userId", u.id);
        localStorage.setItem("userName", u.name);
        localStorage.setItem("role", u.role);

        setUser(u);
        return u;
    };

    const signup = async (payload) => {
        return await signupApi(payload);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
