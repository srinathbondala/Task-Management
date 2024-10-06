import React from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import TaskColumn from "./TaskColumn";
import { TaskStatus} from '../../Types/Task';
import {TaskContext} from '../../hooks/TaskContext';
import { useContext } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd/src';
import AccountMenu from './AccountMenu';
import './Home.css'

const Home:React.FC = () => {
    const taskContext = useContext(TaskContext);
    
    if(!taskContext){
        return <div>Task Context not found</div>; 
    }
    const { tasks, updateStatus} = taskContext;

    return (
        <Container sx={{height:'100%'}}>
            <DndProvider backend={HTML5Backend}>
                <Box sx={{
                    textAlign:'center',
                    maxWidth:'90vw',
                    height:'95%',
                    overflow:'auto',
                    scrollbarWidth: 'none',
                }}>
                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Typography variant="h4" margin={3}>Task Dashboard</Typography>
                    </Box>
                    <Grid container>
                        <Grid item xs={12} md={3.9} className="board-column" >
                            <Typography variant="h6">Backlog</Typography>
                            <TaskColumn
                                status={TaskStatus.Backlog}
                                tasks={tasks.filter(task => task.status === TaskStatus.Backlog)}
                                onDropTask={updateStatus}
                            />
                        </Grid>
                        <Grid item xs={12} md={3.9} className="board-column">
                            <Typography variant="h6">In Progress</Typography>
                            <TaskColumn
                                status={TaskStatus.InProgress}
                                tasks={tasks.filter(task => task.status === TaskStatus.InProgress)}
                                onDropTask={updateStatus}
                            />
                        </Grid>
                        <Grid item xs={12} md={3.9} className="board-column">
                            <Typography variant="h6">Completed</Typography>
                            <TaskColumn
                                status={TaskStatus.Completed}
                                tasks={tasks.filter(task => task.status === TaskStatus.Completed)}
                                onDropTask={updateStatus}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <AccountMenu tasks={tasks} />
            </DndProvider>
        </Container>
    );
}

export default Home;