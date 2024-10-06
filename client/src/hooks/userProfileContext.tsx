import React, { createContext, useContext, useState } from 'react';

interface UserProfile {
    email: string;
    username: string;
    role: string;
    tasks: any[];
}

interface UserProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    return (
        <UserProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
