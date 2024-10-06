import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigator = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, marginBottom:'10px' }}>
      <AppBar position="static" sx={{width:'100vw', backgroundColor:'#2c3e50'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Typography variant='h6' color='inherit'  component="a" href="/" sx={{textDecoration: 'none',}}>Task Manager</Typography>
          </Typography>
          <Box sx={{display: { xs: 'none', md: 'flex' ,gap:'10px'}}}>
            <Typography variant='body1' color='inherit' sx={{textDecoration: 'none','&:hover':{
                color:'lightblue',
                cursor:'pointer'
          }}}
          onClick ={()=>{navigator('about');}}
          >About</Typography>
            <Typography variant='body1' color='inherit' sx={{textDecoration: 'none','&:hover':{
            cursor:'pointer',
            color:'lightblue'
          }}}
          onClick ={()=>{navigator('contact');}}
          >Contact</Typography>
          </Box>
          <Typography color="inherit" sx={{marginLeft:'10px','&:hover':{
            cursor:'pointer',
            color:'lightblue'
          }}}
          onClick ={()=>{navigator('register');}}
          >Register</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}