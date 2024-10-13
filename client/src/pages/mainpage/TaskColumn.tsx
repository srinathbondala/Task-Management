import React from "react";
import { Box} from '@mui/material';
import { Task, TaskStatus } from "../../Types/Task";
import { useDrop } from 'react-dnd/src';
import TaskCard from "./TaskCard";
import { memo } from "react";
import useToken from "../../hooks/useToken";

interface TaskColumnParms{
    status: TaskStatus;
    tasks: Task[];
    onDropTask: (taskId : string, newStatus: TaskStatus ) => void;
    deleteTask ?: (taskId: string) => void;
}
const TaskColumn : React.FC<TaskColumnParms> = ({status, tasks, onDropTask, deleteTask}) =>{
    const { role } = useToken();
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { id: string }) => onDropTask(item.id, status),
    });

    return (
        <Box ref={drop} sx={{ padding: '16px',
            overflowY:'auto',
            bgcolor:'#ecf0f1',
            height:'85%',
            scrollbarWidth: 'thin', 
            '&::-webkit-scrollbar': {
            width: '8px',
            },
            '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
            background: '#a1a1a1',
            }
         }}>
            {tasks.map(task => {
                if(role === 'admin'){
                    return (
                        <TaskCard key={task._id} task={task} deleteTaskA={deleteTask}/>
                    )
                }
                return (<TaskCard key={task._id} task={task} />)
            }
        )}
        </Box>
    );
}

export default memo(TaskColumn);