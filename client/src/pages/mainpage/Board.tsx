import React from "react";
import { Grid, Typography } from "@mui/material";
import TaskColumn from "./TaskColumn";
import { TaskStatus, priorityOrder, BordProps } from "../../Types/Task";
import { memo } from "react";

const Board: React.FC<BordProps> = ({tasks, updateStatus, deleteTask}) => {
    return (
        <Grid container>
            <Grid item xs={12} md={3.9} className="board-column" >
                <Typography variant="h6">Backlog</Typography>
               <TaskColumn
                    status={TaskStatus.Backlog}
                    tasks={tasks.filter(task => task.status === TaskStatus.Backlog).sort((a, b) => {
                        const aPriority = a.priority ? priorityOrder[a.priority] : Infinity;
                        const bPriority = b.priority ? priorityOrder[b.priority] : Infinity;
                        return aPriority - bPriority;
                    })}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />
            </Grid>
            <Grid item xs={12} md={3.9} className="board-column">
                <Typography variant="h6">In Progress</Typography>
                <TaskColumn
                    status={TaskStatus.InProgress}
                    tasks={tasks.filter(t => t.status === TaskStatus.InProgress).sort((a, b) => {
                        const aPriority = a.priority ? priorityOrder[a.priority] : Infinity;
                        const bPriority = b.priority ? priorityOrder[b.priority] : Infinity;
                        return aPriority - bPriority;
                    })}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />
            </Grid>
            <Grid item xs={12} md={3.9} className="board-column">
                <Typography variant="h6">Completed</Typography>
                <TaskColumn
                    status={TaskStatus.Completed}
                    tasks={tasks.filter(task => task.status === TaskStatus.Completed).sort((a, b) => {
                        const aPriority = a.priority ? priorityOrder[a.priority] : Infinity;
                        const bPriority = b.priority ? priorityOrder[b.priority] : Infinity;
                        return aPriority - bPriority;
                    })}
                    onDropTask={updateStatus}
                    deleteTask={deleteTask}
                />
            </Grid>
        </Grid>
    );
};

export default memo(Board);