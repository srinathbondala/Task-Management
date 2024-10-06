import React from 'react';
import { Box, Button, Typography, Grid, Avatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';

interface NavigationContentProps {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const NavigationContent:React.FC<NavigationContentProps> = ({toggleDrawer}) => {
    const navigate = useNavigate();
    const { removeToken } = useToken();
    return (
        <Box sx={{ width: { xs: 250, md: 250 }, height:"100%", maxHeight:'100vh', backgroundColor: '#2c3e50' }}>
            <Box sx={{padding:2, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Typography sx={{ typography: { xs: 'h6', md: 'h5' }, color: 'orange', textAlign: 'center', fontWeight: 'bold', marginBottom: 2 }}>
                    Task Dashboard
                </Typography>
                <Avatar sx={{ width: 80, height: 80, marginBottom: 2 }}>U</Avatar> 
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginBottom: 2 }}>
                    Srinath Bondala
                </Typography>
            </Box>
            <Box sx={{ padding: 3, display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop:'0px' }}>
                <Grid container spacing={2} component="div" alignItems="center" justifyContent="center" >
                    <Grid item xs={12}>
                        <Button onClick={() => {toggleDrawer(false);  navigate('');}} variant="contained" fullWidth>
                            Home
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1} component="div" alignItems="center" justifyContent="center" > 
                            <Grid item xs={12}>
                                <Button onClick={() => {toggleDrawer(false); navigate('analytics');}} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    View Analytics
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={() => {toggleDrawer(false); navigate('profile');}} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    Profile
                                </Button>
                            </Grid>
                            <Grid item xs={12}>  
                                <Button onClick={() => { toggleDrawer(false); removeToken(); window.location.href='/';}} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    Logout
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={() => { toggleDrawer(false); navigate('about');}} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    About
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default NavigationContent;