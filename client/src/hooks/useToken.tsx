import { useState } from 'react';
import Cookies from 'js-cookie';

const useToken = () => {
    const [token, setToken] = useState<string | null>(Cookies.get('token') || null);

    const saveToken = (newToken : string) => {
        Cookies.set('token', newToken, {
            expires:  0.1667,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/'
        });
        setToken(newToken);
    };

    const removeToken = () => {
        Cookies.remove('token');
        setToken(null);
    };
    const checkToken = () =>{
        if(token!== null){
            return true;
        }
        return false;
    }

    return {
        token,
        saveToken,
        removeToken,
        checkToken,
    };
};

export default useToken;