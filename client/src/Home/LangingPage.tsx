import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useToken from '../hooks/useToken';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveToken, saveRole, token, role} = useToken();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(()=>{
    if(token){
        navigate(`${role}/`);
    }
  },[token]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // reset error

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        saveToken(response.data.token);
        saveRole(response.data.user.role);

        localStorage.removeItem('selectedProject');
        localStorage.removeItem('selectedProjectName');

        window.location.href =
          response.data.user.role === 'admin' ? '/admin' : '/user';
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Backend responded with error
        if (error.response) {
          switch (error.response.status) {
            case 401:
              setErrorMessage('Invalid email or password.');
              break;
            case 403:
              setErrorMessage('Access denied.');
              break;
            case 500:
              setErrorMessage('Server error. Please try again later.');
              break;
            default:
              setErrorMessage('Login failed. Please try again.');
          }
        } else {
          // Network / CORS / timeout
          setErrorMessage('Unable to connect to server.');
        }
      } else {
        setErrorMessage('Something went wrong.');
      }
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
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Task Manager
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3, width: '80%' }}>
                Effortlessly manage and track your tasks with Task Manager.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/request')}>
                Get Started
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3, boxShadow: 2, borderRadius: 2 }}>
              <Typography variant="h4" marginBottom={2}>
                Sign In
              </Typography>

              {/* 🔴 Error Message */}
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <form id="login_form" onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                  Don't have an access?
                  <Button onClick={() => navigate('/request')} color="primary">
                    Register
                  </Button>
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
