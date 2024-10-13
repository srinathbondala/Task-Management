import React from "react";
import { Task, TaskStatus } from "../../../Types/Task";
import { useState } from "react";
import { Box, Container, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DndProvider } from "react-dnd/src";
import { HTML5Backend } from "react-dnd-html5-backend";
import ListComponents from "../../../pages/mainpage/ListComponent";
import Board from "../../../pages/mainpage/Board";
import axios from "axios";
import userToken from "../../../hooks/useToken";

interface ProjectMainPageProps {
    selectedProject: string;
    currentTasks: Task[];
    setCurrentTasks : React.Dispatch<React.SetStateAction<Task[]>>;
}


const ProjectMainPage: React.FC<ProjectMainPageProps> = ({selectedProject, currentTasks, setCurrentTasks}) => {
    const { token } = userToken();
    const updateStatus = async (taskId: string, newStatus: TaskStatus) => {
        try {
            console.log("Updating task status");
    
            const response = await axios.put('http://localhost:8080/admin//task/status', {
                taskId,
                status: newStatus
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setCurrentTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task
                    )
                );
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    const DeleteTask = async (taskId: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/admin/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 204){
                setCurrentTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const [viewType, setViewType] = useState<string | null>('Board');

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
                        <Typography variant="h6" margin={3} fontWeight={'bold'}>{viewType === "Board" ? `Board - ${selectedProject}` : `List - ${selectedProject}`}</Typography>
                        <Box sx={{padding:2, display:'flex', gap:'10px',height:'30px'}}>
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
                        {viewType === "Board" ? <Board tasks={currentTasks} updateStatus={updateStatus} deleteTask = {DeleteTask}/> : <ListComponents tasks={currentTasks} />}
                    </Box>
                </Box>
            </DndProvider>
        </Container>
    );
}

export default ProjectMainPage;