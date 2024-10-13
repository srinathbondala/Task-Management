import React from "react";
import { Grid, Typography } from "@mui/material";
import TaskColumn from "./TaskColumn";
import { TaskStatus, BordProps } from "../../Types/Task";
import { memo } from "react";
import useToken from "../../hooks/useToken";

const Board: React.FC<BordProps> = ({tasks, updateStatus, deleteTask}) => {
    const { role } = useToken();
    return (
        <Grid container>
            <Grid item xs={12} md={3.9} className="board-column" >
                <Typography variant="h6">Backlog</Typography>
                {role === 'admin' && (<TaskColumn
                    status={TaskStatus.Backlog}
                    tasks={tasks.filter(task => task.status === TaskStatus.Backlog)}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />)}
                {role !== 'admin' && (
                <TaskColumn
                    status={TaskStatus.Backlog}
                    tasks={tasks.filter(task => task.status === TaskStatus.Backlog)}
                    onDropTask={updateStatus}
                />)}
            </Grid>
            <Grid item xs={12} md={3.9} className="board-column">
                <Typography variant="h6">In Progress</Typography>
                {role === 'admin' && (<TaskColumn
                    status={TaskStatus.InProgress}
                    tasks={tasks.filter(task => task.status === TaskStatus.InProgress)}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />)}
                {role !=='admin' && (<TaskColumn
                    status={TaskStatus.InProgress}
                    tasks={tasks.filter(task => task.status === TaskStatus.InProgress)}
                    onDropTask={updateStatus}
                />)}
            </Grid>
            <Grid item xs={12} md={3.9} className="board-column">
                <Typography variant="h6">Completed</Typography>
                {role === 'admin' && (<TaskColumn
                    status={TaskStatus.Completed}
                    tasks={tasks.filter(task => task.status === TaskStatus.Completed)}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />)}
                {role !== 'admin' && (<TaskColumn
                    status={TaskStatus.Completed}
                    tasks={tasks.filter(task => task.status === TaskStatus.Completed)}
                    onDropTask={updateStatus}
                />)}
            </Grid>
        </Grid>
    );
};

export default memo(Board);