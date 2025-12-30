import React, { useEffect } from "react";
import { Paper, Button, Container, Grid, TextField, Typography, FormControl } from '@mui/material';
import { taskType, taskPriority, TaskStatus, Task } from "../../../Types/Task";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../../../hooks/useToken";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import DueDatePicker from "../../../Helpers/DueDatePicker";
import CustomSelect from "../../../Helpers/CustomSelect";
import CustomTextEditor from "../../../Helpers/CustomTextEditor";
import { deleteTaskApi } from "../../../Utility/taskApi";

interface AdminAddTaskProps {
    tasks?: Task[];
    updateTask: (task: Task) => void;
    deleteTask?: (taskId: string) => void
    projectId: string;
    projectName: string;
}

const AdminAddTask: React.FC<AdminAddTaskProps> = ({ tasks, updateTask, deleteTask ,projectId, projectName }) => {
    const { id } = useParams<{ id?: string }>();
    const [taskTitle, setTaskTitle] = React.useState<string>('');
    const [taskDescription, setTaskDescription] = React.useState<string>('');
    const [taskPriorityValue, setTaskPriorityValue] = React.useState<taskPriority>(taskPriority.Low);
    const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
    const [dueDate, setDueDate] = React.useState<string>('');
    const [taskStatus, setTaskStatus] = React.useState<TaskStatus>(TaskStatus.Backlog);
    const [createdAt, setCreatedAt] = React.useState<string>('');
    const [updatedAt, setUpdatedAt] = React.useState<string>('');
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
                    setCreatedAt(task.created_at);
                    setUpdatedAt(task.updated_at);
                    setTaskStatus(task.status);
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
            setCreatedAt(new Date().toISOString());
            setUpdatedAt( new Date().toISOString());
            setTaskStatus(TaskStatus.Backlog);
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
        const now = new Date().toISOString();

        const updatedTask: Task = {
        _id: id || "",
        title: taskTitle,
        description: taskDescription,
        priority: taskPriorityValue,
        category: taskType.Work,
        due_date: dueDate,
        status: TaskStatus.Backlog,
        user: selectedUser || undefined,
        created_at: id ? createdAt : now,
        updated_at: now,
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

    const deleteAdminTask = async () =>{
        if (loading) return;
        setLoading(true);
        try{
            const response = await deleteTaskApi(id ?? "",token ?? "");
            if(response === 204){
                if(deleteTask != undefined)
                    deleteTask(id??"");
                setDialogMessage(`Task deleted successfully!`);
                setOpenDialog(true);
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            }
        } catch(error){
            console.error("An error occurred:", error);
        } finally{
            setLoading(false);
        }
    }

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
                            {/* <TextField
                                label="Description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            /> */}
                             <CustomTextEditor
                                value={taskDescription}
                                onChange={setTaskDescription}
                                placeholder="Add detailed task information..."
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Select
                                value={taskPriorityValue}
                                onChange={(e) => setTaskPriorityValue(e.target.value as taskPriority)}
                                fullWidth
                            >
                                <MenuItem value="" disabled>Select Category</MenuItem>
                                <MenuItem value={taskPriority.Low}>Low</MenuItem>
                                <MenuItem value={taskPriority.Medium}>Medium</MenuItem>
                                <MenuItem value={taskPriority.High}>High</MenuItem>
                            </Select> */}
                            
                            <CustomSelect
                                label="Priority Status"
                                required
                                value={taskPriorityValue}
                                onChange={setTaskPriorityValue}
                                options={[
                                    { label: "Low", value: taskPriority.Low },
                                    { label: "Medium", value: taskPriority.Medium },
                                    { label: "High", value: taskPriority.High },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DueDatePicker
                               dueDate={dueDate}
                               setDueDate={setDueDate}
                           />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Created At"
                                value={createdAt}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Updated At"
                                value={updatedAt}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        {projectName !== 'SELF' && (
                            <Grid item xs={8}>
                                <CustomSelect
                                label="Assign User"
                                required
                                value={selectedUser ?? ''}
                                onChange={setSelectedUser}
                                options={ [
                                    { label: "None", value: "" },
                                    ...users.map((user) => ({
                                        label: user.email,
                                        value: user._id,
                                    })),
                                ]}
                            />
                            </Grid>
                        )}
                        <Grid item xs={12} display={'flex'} gap={'10px'}>
                            <Button type="submit" variant="outlined" color="primary">
                                {id ? 'Update Task' : 'Add Task'}
                            </Button>
                            {id && <Button variant="outlined" onClick={deleteAdminTask} color='error'> Delete Task </Button>}
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
