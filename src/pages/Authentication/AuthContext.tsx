import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
    token: string | null;
    role: string | null;
    store_id: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    token: null,
    role: null,
    store_id: null,
    login: () => { }, 
    logout: () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [store_id, setStore_id] = useState<string | null>(localStorage.getItem('store_id'));
    const navigate = useNavigate();
 
    const login = (token: string, role: string,store_id:string) => {
        setToken(token);
        setRole(role);
        setStore_id(store_id)
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('store_id', store_id);
        navigate('/'); // Foydalanuvchini login qilgandan so'ng yo'naltirish
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('store_id');
        navigate('/auth/signin'); // Logoutdan so'ng yo'naltirish
    };

    return (
        <AuthContext.Provider value={{ token, role,store_id, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
