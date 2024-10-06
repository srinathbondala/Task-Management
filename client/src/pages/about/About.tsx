import React from "react";
import {Box, Container, Paper, Typography} from '@mui/material'

const About: React.FC = () => {
  return (
    <Container>
      <Box sx={{display:"flex", alignItems:"center", justifyContent:"center", width:'100%', height:'100%', marginTop:'10px'}}>
        <Paper sx={{width:'90%', height:'100%', padding:'10px'}}>
          <Typography variant="h3" textAlign={"center"}>About</Typography>
          <hr />
          <Box>
            <Typography variant="h5" textAlign={'center'}>Task Management Dashboard with Analytics</Typography>
            <br />
              <Box sx={{textAlign:'none'}}>
                <Typography><strong>Description: </strong>Create a Kanban-style task management system with analytics for tracking task completion rates and user performance.</Typography>
                <Typography><strong>Features:</strong></Typography>
                <ul>
                  <li>Drag-and-drop functionality using react-dnd.</li>
                  <li>Use TypeScript for defining task structures and status enums.</li>
                  <li>Implement a dashboard using react-chartjs-2 to show stats on tasks completed, ongoing, and upcoming.</li>
                  <li>Create type-safe custom hooks for analytics data.</li>
                </ul>
                <Typography><strong>Core Concepts:</strong></Typography>
                <Typography>Context API for user data, enums for task statuses, typing chart data, and error handling.</Typography>
                <Typography><strong>Bonus: </strong>Include user tagging and task assignment.</Typography>
              </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;