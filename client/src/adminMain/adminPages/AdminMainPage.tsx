import { Box, Button, Paper, Typography, Container } from "@mui/material";
import { useUserProfile } from "../../hooks/userProfileContext";
import { useNavigate } from 'react-router-dom';
const AdminMainPage: React.FC = () => {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  return (
    <Container sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--bxp-charlie-display-font-family)' }}>
      <Box sx={{ width: '80%',gap: '10px', display: 'flex', flexDirection: 'column'}}>
        <Typography variant="h4" sx={{ fontWeight: '500', fontSize: { md: '3pc' } }}>Welcome back, {profile?.username}</Typography>
        <Typography variant="h5" sx={{ fontWeight: '500' }}>What would you like to do today?</Typography>

        <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: '5px' }}>
              <img src="https://th.bing.com/th/id/OIP.Yaq41nkWdGG3Lu6pxR-wzAHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="placeholder" style={{ width: '50px' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: '500' }}>Manage Tasks</Typography>
                <Typography variant="body1">Create, edit, delete and assign tasks to your team members</Typography>
              </Box>
            </Box>
            <Button variant="contained" sx={{ alignSelf: 'center' }} onClick={()=>{
                navigate('dashboard');
            }}>Manage Tasks</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminMainPage;
