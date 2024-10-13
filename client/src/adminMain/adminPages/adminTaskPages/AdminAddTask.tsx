import React, { useCallback, useEffect } from "react";
import { Paper, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { InputLabel, MenuItem, Select } from "@mui/material";
import { taskType, taskPriority, TaskStatus, Task } from "../../../Types/Task";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../../../hooks/useToken";

interface AdminAddTaskProps {
    updateTask: (task: Task) => void;
    projectId: string;
    projectName: string;
}

const AdminAddTask: React.FC<AdminAddTaskProps> = ({updateTask,projectId, projectName}) => {
    const { id } = useParams<{ id?: string }>();
    const [taskTitle, setTaskTitle] = React.useState<string>('');
    const [taskDescription, setTaskDescription] = React.useState<string>('');
    const [taskPriorityValue, setTaskPriorityValue] = React.useState<taskPriority>(taskPriority.Low);
    const [selectedUser, setSelectedUser] = React.useState<string | null>(null); 
    const [dueDate, setDueDate] = React.useState<string>('');
    const { token } = useToken();
    const navigate = useNavigate();
    const [users, setUsers] = React.useState<{id: string, email: string}[]>([]);

    useEffect(()=>{
        if(id){
            // loadDetails();
        }
    },[]);

    useCallback(() => {
        axios.get(`http://localhost:8080/admin/projects/${projectId}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [projectId, token]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTask: Task = {
            _id: '',
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

        axios.post('http://localhost:8080/admin/task', {
            name: taskTitle,
            description: taskDescription,
            priority: taskPriorityValue,
            dueDate: dueDate,
            userId: selectedUser,
            projectId: projectId,
            projectName: projectName,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            newTask._id = response.data;
            updateTask(newTask);
            navigate(-1);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <Container>
            <Paper elevation={3} sx={{padding:'10px'}}>
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
                        <Grid item xs={12}>
                            <InputLabel>Assign User</InputLabel>
                            <Select
                                value={selectedUser ?? ''} 
                                onChange={(e) => setSelectedUser(e.target.value || null)} 
                                fullWidth
                            >
                                <MenuItem value="">None</MenuItem>
                                {/* Render user options dynamically */}
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>{user.email}</MenuItem>
                                ))}
                                {/* <MenuItem value="user1">User 1</MenuItem>
                                <MenuItem value="user2">User 2</MenuItem> */}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="outlined" color="primary">
                                {id ? 'Update Task' : 'Add Task'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminAddTask;
