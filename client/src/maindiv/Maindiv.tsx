import React from 'react';
import { Box, Container} from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Profile from '../pages/profile/Profile'
import About from '../pages/about/About'
import NavigationBar from '../navigation/NavigationBar'
import Home from '../pages/mainpage/Home'
import Analytics from '../pages/Analytics/Analytics';
import AddTask from '../pages/taskpages/AddTask';
import { TaskProvider } from '../hooks/TaskContext'
const Maindiv: React.FC = () => {
    return (
      <>
        <TaskProvider>
            <NavigationBar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                // marginLeft: { md: '300px' },
                height: '100vh',
              }}
            >
              <Container disableGutters maxWidth={false} sx={{height:'100%',paddingTop: { xs: '56px', sm: '64px', md: '0',overflow:'auto' },}}>
                <Box sx={{ bgcolor: '#ecf0f1', display: 'flex', alignItems: 'center',height:'100%' }}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/addtask/" element={<AddTask />} />
                      <Route path="/edit/:id" element={<AddTask />} />
                      <Route path="*" element={<><h1>Not Found</h1></>} />
                    </Routes>
                </Box>
              </Container>
            </Box> 
        </TaskProvider>
      </>
    );
}
export default Maindiv;