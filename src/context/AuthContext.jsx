
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check valid session on load (optional implementation if we had a /me endpoint)
    // For now, let's just use localStorage if available to persist basic session
    useEffect(() => {
        const storedUser = localStorage.getItem('sparkz_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Login attempt:', email, password);
            const API_URL = import.meta.env.VITE_API_URL || 'https://sparkz-server.onrender.com';
            const response = await axios.post(`${API_URL}/user/login`, { email, password });

            const userData = response.data;
            if (userData) {
                setUser(userData);
                localStorage.setItem('sparkz_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (type, userData) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://sparkz-server.onrender.com';
            const endpoint = type === 'kare' ? '/user/kare' : '/user/external';

            const response = await axios.post(`${API_URL}${endpoint}`, userData);

            const newUser = response.data;
            if (newUser) {
                // If the backend returns the created user object, set it. 
                // Note: Ensure backend returns the full user object, not just { acknowledged: true, ... }
                // For now assuming backend returns user object or we might need to adjust based on backend fix.
                setUser(newUser);
                localStorage.setItem('sparkz_user', JSON.stringify(newUser));
                return { success: true };
            } else {
                return { success: false, message: 'Registration failed' };
            }
        } catch (error) {
            console.error("Registration error:", error);
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sparkz_user');
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        localStorage.setItem('sparkz_user', JSON.stringify({ ...user, ...userData }));
    }

    const googleLogin = async (email, name) => {
        try {
            console.log('Google Login attempt:', email, name);
            const API_URL = import.meta.env.VITE_API_URL || 'https://sparkz-server.onrender.com';
            // Using /user/kare endpoint as discussed in the plan
            const response = await axios.post(`${API_URL}/user/kare`, { email, name });

            const userData = response.data;
            if (userData) {
                setUser(userData);
                localStorage.setItem('sparkz_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: 'Login failed' };
            }
        } catch (error) {
            console.error("Google Login error:", error);
            const message = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
