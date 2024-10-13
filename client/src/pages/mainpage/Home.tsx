import React from "react";
import { Container, Box, Typography, Select, MenuItem} from "@mui/material";
import ListComponents from './ListComponent';
// import TaskColumn from "./TaskColumn";
// import { TaskStatus} from '../../Types/Task';
import {TaskContext} from '../../hooks/TaskContext';
import { useContext } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd/src';
import AccountMenu from './AccountMenu';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Task } from '../../Types/Task';
import Board from './Board';
import './Home.css'

const Home:React.FC = () => {
    const taskContext = useContext(TaskContext);
    const [viewType, setViewType] = React.useState<string | null>('Board');
    const [selectedProject, setSelectedProject] = useState<string >('All');
    
    if(!taskContext){
        return <div>Task Context not found</div>; 
    }
    const { tasks, updateStatus} = taskContext;
    const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedProjectValue = event.target.value as string;
        setSelectedProject(selectedProjectValue);
        if(selectedProjectValue === 'All') {setCurrentTasks(tasks);}
        else{
            setCurrentTasks(tasks.filter(task => task.project === selectedProjectValue));
        }
    };

    React.useEffect(() => {
        if(selectedProject === 'All') {setCurrentTasks(tasks);}
        else{
            setCurrentTasks(tasks.filter(task => task.project === selectedProject));
        }
    },[tasks, selectedProject]);

    const handleTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newViewType: string | null
      ) => {
        if (newViewType !== null) {
          setViewType(newViewType);
        }
      };

    return (
        <Container sx={{height:'100%'}}>
            <DndProvider backend={HTML5Backend}>
                <Box sx={{
                    textAlign:'center',
                    maxWidth:'95vw',
                    height:'95%',
                    overflow:'auto',
                    scrollbarWidth: 'none',
                }}>
                    <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <Typography variant="h4" margin={3} fontWeight={'bold'}>{viewType === "Board" ? "Board" : "List"}</Typography>
                        <Box sx={{padding:2, display:'flex', gap:'10px',height:'40px'}}>
                            <Select 
                                // label="Project"
                                name="Project"
                                id="project"
                                value={selectedProject}    
                                onChange={handleChange}
                                sx={{maxWidth:'180px', minWidth:'120px'}}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="SELF">Personal</MenuItem>
                                <MenuItem value='Project X'>Project X</MenuItem>
                                <MenuItem value='Project Y'>Project Y</MenuItem>
                            </Select>
                            <ToggleButtonGroup
                                exclusive
                                value={viewType}
                                onChange={handleTypeChange}
                                sx={{ display: "flex", justifyContent: "center"}}
                            >
                                <ToggleButton value="Board">Board</ToggleButton>
                                <ToggleButton value="List">List</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <Box>
                        {viewType === "Board" ? <Board tasks={currentTasks} updateStatus={updateStatus} /> : <ListComponents tasks={currentTasks} />}
                    </Box>
                </Box>
                <AccountMenu tasks={currentTasks} />
            </DndProvider>
        </Container>
    );
}

export default Home;