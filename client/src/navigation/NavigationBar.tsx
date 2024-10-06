import React, { memo, useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavigationContent from './NavigationContent';

function NavigationBar() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [permanentDrawerOpen, setPermanentDrawerOpen] = useState<boolean>(true);

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
        <NavigationContent toggleDrawer={toggleDrawer} />
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
            cursor: 'pointer',
            backgroundColor: '#2c3e50' 
          }}
          onClick={togglePermanentDrawer}
        >
          {permanentDrawerOpen ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <MenuIcon sx={{ color: 'white' }}/>}
        </Box>
        {permanentDrawerOpen && <NavigationContent toggleDrawer={toggleDrawer} />}
      </Drawer>
    </>
  );
}

export default memo(NavigationBar);
