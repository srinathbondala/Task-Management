import React from "react";
import { Container, Box, Typography} from "@mui/material";
import ListComponents from './ListComponent';
// import TaskColumn from "./TaskColumn";
// import { TaskStatus} from '../../Types/Task';
import {TaskContext} from '../../hooks/TaskContext';
import { useContext } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd/src';
import AccountMenu from './AccountMenu';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Bord from './Board';
import './Home.css'

const Home:React.FC = () => {
    const taskContext = useContext(TaskContext);
    const [viewType, setViewType] = React.useState<string | null>('Board');
    
    if(!taskContext){
        return <div>Task Context not found</div>; 
    }
    const { tasks, updateStatus} = taskContext;

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
                        <Box sx={{padding:2}}>
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
                        {viewType === "Board" ? <Bord tasks={tasks} updateStatus={updateStatus} /> : <ListComponents tasks={tasks} />}
                    </Box>
                </Box>
                <AccountMenu tasks={tasks} />
            </DndProvider>
        </Container>
    );
}

export default Home;