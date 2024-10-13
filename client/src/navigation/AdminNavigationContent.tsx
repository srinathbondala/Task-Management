import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { useUserProfile } from '../hooks/userProfileContext';
import axios from 'axios';

interface NavigationContentProps {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const AdminNavigationContent: React.FC<NavigationContentProps> = ({ toggleDrawer }) => {
    const navigate = useNavigate();
    const { removeToken, token, removeRole } = useToken(); 
    const { profile, setProfile } = useUserProfile();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if(response.status === 401){
                    removeToken();
                    removeRole();
                    alert("Session expired. Please login again.");
                    localStorage.removeItem('selectedProjectId');
                    localStorage.removeItem('selectedProjectName');
                    navigate('/');
                }
                const updatedProfile = {
                    ...response.data,
                    projects: [...new Set([...response.data.projects, {id:"123", name:'SELF'}])],
                };
                setProfile(updatedProfile);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user profile');
            }
        };

        if (!profile && token) {
            fetchUserProfile();
        }
    }, [profile, token, setProfile]);

    return (
        <Box sx={{ width: { xs: 250, md: 250 }, height: "100%", maxHeight: '100vh', backgroundColor: '#2c3e50' }}>
            <Box sx={{ padding: 1, display: 'flex', alignItems:'center'}}>
                <Box sx={{padding:1}}>
                    <Avatar sx={{ width: 50, height: 50, marginBottom: 2 }}>
                        {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                </Box>
                <Box>
                    <Typography sx={{ typography: { xs: 'h6' }, color: 'orange', textAlign: 'center', fontWeight: 'bold'}}>
                        Task Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginBottom: 2 }}>
                        {profile?.username || 'Loading...'}
                    </Typography>
                    {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
                </Box>
            </Box>
            <Box sx={{ padding: 3, display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop: '0px' }}>
                <Grid container spacing={2} component="div" alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <Button onClick={() => { toggleDrawer(false); navigate('dashboard'); }} variant="contained" fullWidth>
                            DashBoard
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1} component="div" alignItems="center" justifyContent="center">
                            <Grid item xs={12}>
                                <Button onClick={() => { toggleDrawer(false); navigate('profile'); }} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    Profile
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={() => { toggleDrawer(false); navigate('register'); }} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    Register
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={() => { toggleDrawer(false); removeToken(); removeRole(); localStorage.removeItem('selectedProject'); localStorage.removeItem('selectedProjectId'); window.location.href = '/'; }} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
                                    Logout
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={() => { toggleDrawer(false); navigate('about'); }} variant="outlined" fullWidth sx={{ color: 'white', borderColor: 'white' }}>
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

export default AdminNavigationContent;
