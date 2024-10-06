import React from 'react';
import { Box } from '@mui/material';
import Header from './header';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: "flex", flexDirection:'column' }}>
            <Header />
            <Outlet />
        </Box>
    );
};

export default MainLayout;
