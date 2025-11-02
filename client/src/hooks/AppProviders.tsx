// components/AppProviders.tsx
import React from 'react';
import { UserProfileProvider } from './userProfileContext';
import { SnackbarProvider } from './SnackbarProvider';


type AppProvidersProps = {
  children: React.ReactNode;
};

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <UserProfileProvider>
      <SnackbarProvider>
          {children}
      </SnackbarProvider>
    </UserProfileProvider>
  );
};

export default AppProviders;
