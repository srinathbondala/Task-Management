import React, { useEffect } from "react";
import { Paper, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { InputLabel, MenuItem, Select } from "@mui/material";
import { taskType, taskPriority, TaskStatus, Task } from "../../../Types/Task";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../../../hooks/useToken";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface AdminAddTaskProps {
    tasks?: Task[];
    updateTask: (task: Task) => void;
    projectId: string;
    projectName: string;
}

const AdminAddTask: React.FC<AdminAddTaskProps> = ({ tasks, updateTask, projectId, projectName }) => {
    const { id } = useParams<{ id?: string }>();
    const [taskTitle, setTaskTitle] = React.useState<string>('');
    const [taskDescription, setTaskDescription] = React.useState<string>('');
    const [taskPriorityValue, setTaskPriorityValue] = React.useState<taskPriority>(taskPriority.Low);
    const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
    const [dueDate, setDueDate] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const { token } = useToken();
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [dialogMessage, setDialogMessage] = React.useState<string>('');
    const navigate = useNavigate();
    const [users, setUsers] = React.useState<{ _id: string, email: string }[]>([]);
    const [previousUserId, setPreviousUserId] = React.useState<string | null>(null); 

    useEffect(() => {
        if (id) {
            tasks?.forEach(task => {
                if (task._id === id) {
                    const isoDateString = task.due_date ?? '';
                    const formattedDate = isoDateString.split('T')[0];
                    setTaskTitle(task.title);
                    setTaskDescription(task.description);
                    setTaskPriorityValue(task.priority ?? taskPriority.Low);
                    setDueDate(formattedDate ?? '');
                    setSelectedUser(task.user || null);
                    setPreviousUserId(task.user || null); 
                }
            });
        }
        else{
            setTaskTitle('');
            setTaskDescription('');
            setTaskPriorityValue(taskPriority.Low);
            setDueDate('');
            setSelectedUser(null);
            setPreviousUserId(null);
        }
    }, [id]);

    useEffect(() => {
        if (projectId === '123') return;
        axios.get(`http://localhost:8080/admin/projects/${projectId}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [projectId, token]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const updatedTask: Task = {
            _id: id || '',
            title: taskTitle,
            description: taskDescription,
            priority: taskPriorityValue,
            category: taskType.Work,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            due_date: dueDate,
            status: TaskStatus.Backlog,
            user: selectedUser || undefined
        };

        const userIdToSend = (selectedUser !== previousUserId) ? selectedUser : previousUserId;

        const requestMethod = id ? axios.put : axios.post;
        const url = id ? `http://localhost:8080/admin/task/${id}` : 'http://localhost:8080/admin/task';

        requestMethod(url, {
            title: taskTitle,
            description: taskDescription,
            priority: taskPriorityValue,
            due_date: dueDate,
            userId: userIdToSend || null, 
            projectId: projectId,
            projectName: projectName,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (!id) {
                updatedTask._id = response.data; 
            }
            updateTask(updatedTask);
            setDialogMessage(`Task ${id ? 'updated' : 'added'} successfully!`);
            setOpenDialog(true);
            setTimeout(() => {
                if (!id) navigate(-1);
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: '10px' }}>
                <Typography variant="h5" gutterBottom>{id ? 'Edit Task' : 'Add Task'}</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Task Title"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={taskPriorityValue}
                                onChange={(e) => setTaskPriorityValue(e.target.value as taskPriority)}
                                fullWidth
                            >
                                <MenuItem value={taskPriority.Low}>Low</MenuItem>
                                <MenuItem value={taskPriority.Medium}>Medium</MenuItem>
                                <MenuItem value={taskPriority.High}>High</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Due Date</InputLabel>
                            <TextField
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        {projectName !== 'SELF' && (
                            <Grid item xs={12}>
                                <InputLabel>Assign User</InputLabel>
                                <Select
                                    value={selectedUser ?? ''}
                                    onChange={(e) => { 
                                        setSelectedUser(e.target.value || null); 
                                        console.log(e.target.value);
                                    }}
                                    fullWidth
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {users.map((user, index) => (
                                        <MenuItem key={index} value={user._id}>{user.email}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        )}
                        <Grid item xs={12} display={'flex'} gap={'10px'}>
                            <Button type="submit" variant="outlined" color="primary">
                                {id ? 'Update Task' : 'Add Task'}
                            </Button>
                            {id && <Button variant="outlined" color='error'> Delete Task </Button>}
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminAddTask;
