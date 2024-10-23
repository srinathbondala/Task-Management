import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, Avatar, Grid } from '@mui/material';
import { useUserProfile } from '../../hooks/userProfileContext';
import useToken from '../../hooks/useToken';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useToken();
    const { profile } = useUserProfile();
    const { setProfile } = useUserProfile();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setProfile(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };
        
        if (!profile) {
            fetchUserProfile();
        }
    }, [profile, setProfile, token]);

    useEffect(() => {
        if (profile) {
            setUser(profile);
            setLoading(false);
        }
    }, [profile]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={3} sx={{ padding: 5, width: '100%', maxWidth: '600px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <Avatar 
                                alt={user.username} 
                                sx={{ width: 100, height: 100, margin: '0 auto' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h4" gutterBottom>User Profile</Typography>
                            <hr />
                            <Typography variant="h6"><strong>User Name: </strong>{user.username}</Typography>
                            <Typography variant="h6"><strong>Email: </strong>{user.email}</Typography>
                            <Typography variant="h6"><strong>First Name: </strong>{user.firstName}</Typography>
                            <Typography variant="h6"><strong>Last Name: </strong>{user.lastName}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Profile;
