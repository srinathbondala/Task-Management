import React, { createContext, useContext, useState } from 'react';

interface UserProfile {
    email: string;
    username: string;
    fistName: string;
    lastName: string;
    role: 'admin' | 'user';
    tasks: string[];
    projects?: {
        id: string; 
        name: string; 
    }[];
}

interface UserProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
    updateProjects: (projects: any[]) => void;
    selectedProjectContext: string | null;
    setSelectedProjectContext: (project: string ) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [selectedProjectContext, setSelectedProjectContext] = useState<string | null>('');

    const updateProjects = (projects: { id: string; name: string }[]) => {
        setProfile((prevProfile) => {
            if (prevProfile) {
                return { ...prevProfile, projects };
            }
            return prevProfile;
        });
    };

    return (
        <UserProfileContext.Provider value={{ profile, setProfile , updateProjects, selectedProjectContext , setSelectedProjectContext}}>
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
