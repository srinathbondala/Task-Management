import React, { useState, useContext } from "react";
import { Paper, Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useDrag } from 'react-dnd/src';
import { Task } from "../../Types/Task";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TaskContext } from "../../hooks/TaskContext";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const [openConfirm, setOpenConfirm] = useState(false);

    const taskContext = useContext(TaskContext);
    if (!taskContext) {
        return <div>Task Context not found</div>;
    }

    const { deleteTask } = taskContext;
    const navigate = useNavigate();

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    function onView() {
        navigate('edit/' + task._id);
    }

    function onDelete() {
        setOpenConfirm(true);
    }

    function handleConfirmDelete() {
        deleteTask(task._id);
        setOpenConfirm(false);
    }

    function handleCancelDelete() {
        setOpenConfirm(false);
    }

    return (
        <>
            <Paper
                ref={drag}
                elevation={3}
                sx={{
                    padding: '16px',
                    marginBottom: '8px',
                    backgroundColor: isDragging ? 'lavender' : 'white',
                    cursor: 'move',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <Box>
                    <Typography
                        variant='subtitle1'
                        textAlign="start"
                        sx={{ fontWeight: 'bold' }}
                        onClick={onView}
                        style={{ cursor: 'pointer' }}
                    >
                        {task.title}
                    </Typography>

                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'start',
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                        }}
                    >
                        {task.description}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                        <Typography variant='caption' textAlign="start" sx={{ color: 'text.secondary' }}>
                            Created: {task.created_at}
                        </Typography>
                        <Typography variant='caption' textAlign="start" sx={{ color: 'text.secondary' }}>
                            Updated: {task.updated_at}
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={onView} aria-label="view" size="small" sx={{ color: 'primary.main' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton onClick={onDelete} aria-label="delete" size="small" sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirm} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this task?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskCard;
