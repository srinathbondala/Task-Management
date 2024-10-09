import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper} from '@mui/material';
import { useUserProfile} from '../../hooks/userProfileContext';
import useToken from '../../hooks/useToken';

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
        
        if(!profile){
            fetchUserProfile();
        }
    }, []);

    useEffect(() => {
        if(profile){
            setUser(profile);
            setLoading(false);
        }
    });
    
    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ padding: 3 , display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
            <Paper elevation={3} sx={{ padding: 3 , width:'80%'}}>
                <Typography variant="h4" gutterBottom>User Profile</Typography>
                <hr />
                <Typography variant="h6"><strong>User Name: </strong>{user.username}</Typography>
                <Typography variant="h6"><strong>Email: </strong>{user.email}</Typography>
                <Typography variant="h6"><strong>First Name: </strong>{user.firstName}</Typography>
                <Typography variant="h6"><strong>Last Name: </strong>{user.lastName}</Typography>
            </Paper>
        </Box>
    );
};

export default Profile;
