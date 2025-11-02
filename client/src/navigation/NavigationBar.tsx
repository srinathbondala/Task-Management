import React, { memo, useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Typography, Box, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavigationContent from './NavigationContent';
import { useLocation } from 'react-router-dom';
import AdminNavigationContent from './AdminNavigationContent';

function NavigationBar() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [permanentDrawerOpen, setPermanentDrawerOpen] = useState<boolean>(true);
  const isAdmin = useLocation().pathname.startsWith('/admin');

  const toggleDrawer = (open: boolean) => (_event: React.KeyboardEvent | React.MouseEvent) => {
    setDrawerOpen(open);
  };

  const togglePermanentDrawer = () => {
    setPermanentDrawerOpen(!permanentDrawerOpen);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ display: { xs: 'block', md: 'none' }, backgroundColor: '#2c3e50'}}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Task Dashboard</Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      {isAdmin ? (
          <AdminNavigationContent toggleDrawer={toggleDrawer} />
        ) : (
          <NavigationContent toggleDrawer={toggleDrawer} />
        )}
        {/* <NavigationContent toggleDrawer={toggleDrawer} /> */}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: permanentDrawerOpen ? 250 : 60, 
          '& .MuiDrawer-paper': { width: permanentDrawerOpen ? 250 : 60 },
          transition: 'width 0.3s',
        }}
        open
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: permanentDrawerOpen ? 'flex-end' : 'center',
            padding: '0.5rem',
            backgroundColor: '#2c3e50'
          }}
        >
          {permanentDrawerOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: permanentDrawerOpen ? 'flex-start' : 'center' }} >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 1 }} >
                <img src="public\vite.svg" alt="Logo" style={{ width: 40, height:20}} />
                <Typography variant='caption' sx={{ color: 'white', flexGrow: 1, textAlign: 'center', display: permanentDrawerOpen ? 'block' : 'none' }}>
                  Task Dashboard
                </Typography>
              </Box>
            </Box>
          )}
          {permanentDrawerOpen ? <ChevronLeftIcon sx={{ color: 'white', cursor: 'pointer' }}  onClick={togglePermanentDrawer} /> : <MenuIcon sx={{ color: 'white', cursor: 'pointer' }}  onClick={togglePermanentDrawer} />}
        </Box>
        {permanentDrawerOpen && (isAdmin ? (
          <AdminNavigationContent toggleDrawer={toggleDrawer} />
        ) : (
          <NavigationContent toggleDrawer={toggleDrawer} />
        ))}
      </Drawer>
    </>
  );
}

export default memo(NavigationBar);
