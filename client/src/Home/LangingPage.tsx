import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useToken from '../hooks/useToken';
import { useUserProfile } from '../hooks/userProfileContext';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { saveToken } = useToken();
    const [loading, setLoading] = useState(false);
    const { setProfile } = useUserProfile();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password });
            saveToken(response.data.token);
            setProfile(response.data.user);
            window.location.href = '/user/';
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container disableGutters maxWidth={false} sx={{ bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%', padding: 5 }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ padding: 3 }}>
                            <Typography variant="h3" gutterBottom fontWeight={'bold'}>Task Manager</Typography>
                            <Typography variant="body1" sx={{ marginBottom: 3, width: '80%' }}>
                                Effortlessly manage and track your tasks with Task Manager.
                            </Typography>
                            <Button variant="contained" size="large" onClick={() => navigate('/register')}>Get Started</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, boxShadow: 2, borderRadius: 2 }}>
                            <Typography variant="h4" marginBottom={2}>Sign In</Typography>
                            <form id="login_form" onSubmit={handleLogin}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }} disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : 'Login'}
                                </Button>
                                <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                                    Don't have an account? 
                                    <Button onClick={() => navigate('/register')} color="primary"> Register</Button>
                                </Typography>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default LandingPage;
