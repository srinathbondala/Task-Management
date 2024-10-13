import React from 'react';
import { Box, Container} from '@mui/material';
import {Routes, Route} from 'react-router-dom'
import Profile from '../pages/profile/Profile'
import About from '../pages/about/About'
import NavigationBar from '../navigation/NavigationBar'
import Register from '../Home/Register';
import AdminHome from './adminPages/AdminHome';
import AdminMainPage from './adminPages/AdminMainPage';
// import { TaskProvider } from '../hooks/TaskContext'

const AdminPage : React.FC = () => {
    return (
        <>
        {/* <TaskProvider> */}
            <NavigationBar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'hidden',
                height: '100vh',
              }}
            >
              <Container disableGutters maxWidth={false} sx={{height:'100%',paddingTop: { xs: '56px', sm: '64px', md: '0px'}, padding:{ md:'10px'}}}>
                <Box sx={{ bgcolor: '#ecf0f1', display: 'flex', alignItems: 'center',height:'100%', overflow:'auto'}}>
                    <Routes>
                      <Route path="/" element={<AdminMainPage />} />
                      <Route path="/dashboard/*" element={<AdminHome />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/about" element={<About />} />
                      <Route path='/register' element={ <Register />} />
                      <Route path="*" element={<><h1>Not Found</h1></>} />
                    </Routes>
                </Box>
              </Container>
            </Box> 
        {/* </TaskProvider> */}
        </>
    );
};
export default AdminPage;