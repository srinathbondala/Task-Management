import { useState } from 'react';
import Cookies from 'js-cookie';

const useToken = () => {
    const [token, setToken] = useState<string | null>(Cookies.get('token') || null);
    const [role, setRole] = useState<string | null>(Cookies.get('role') || null);

    const saveToken = (newToken: string) => {
        // Cookies.set('token', newToken, { expires: 1 / 24, secure: true, sameSite: 'Strict' });
        setToken(newToken);
    };

    const saveRole = (newRole: string) => {
        // Cookies.set('role', newRole, { expires: 1 / 24,  secure: true, sameSite: 'Strict' });
        setRole(newRole);
    };

    const removeToken = () => {
        Cookies.remove('token');
        setToken(null);
    };

    const removeRole = () => {
        Cookies.remove('role');
        setRole(null);
    };

    const checkUser = () => role === 'user';
    const checkAdmin = () => role === 'admin';
    const checkToken = () => token !== null;

    return {
        token,
        role,
        saveToken,
        saveRole,
        removeRole,
        checkUser,
        checkAdmin,
        removeToken,
        checkToken,
    };
};

export default useToken;
