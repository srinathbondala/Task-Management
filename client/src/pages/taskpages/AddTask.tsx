import React, { useEffect, useContext } from "react";
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { taskType, taskPriority, TaskStatus, Task } from "../../Types/Task";
import { useParams } from "react-router-dom";
import { TaskContext } from "../../hooks/TaskContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../../hooks/useToken";

const AddTask: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const taskContext = useContext(TaskContext);
    const [selectedCategory, setSelectedCategory] = React.useState<taskType>(taskType.Personal);
    const [taskTitle, setTaskTitle] = React.useState<string>('');
    const [taskDescription, setTaskDescription] = React.useState<string>('');
    const [taskPriorityValue, setTaskPriorityValue] = React.useState<taskPriority>(taskPriority.Low);
    const [taskStatus, setTaskStatus] = React.useState<TaskStatus>(TaskStatus.Backlog);
    const [createdAt, setCreatedAt] = React.useState<string>('');
    const [updatedAt, setUpdatedAt] = React.useState<string>('');
    const [dueDate, setDueDate] = React.useState<string>('');
    const { token } = useToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && taskContext) {
            const task = taskContext.tasks.find(task => task._id == id);
            if (task) {
                setTaskTitle(task.title);
                setTaskDescription(task.description);
                setTaskPriorityValue(task.priority ?? taskPriority.Low);
                setSelectedCategory(task.category ?? taskType.Personal);
                setTaskStatus(task.status ?? TaskStatus.Backlog);
                setCreatedAt(task.created_at);
                setUpdatedAt(task.updated_at);
                setDueDate(formatDateToDisplay(task.due_date??''));
            }
        }
    }, [id, taskContext]);

    const formatDateToDisplay = (dateString: string) => {
        const date = new Date(dateString);
        const day = (`0${date.getDate()}`).slice(-2);
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        let userid : string = "";
        e.preventDefault();
        
        const newTask: Task = {
            _id: userid || '',
            title: taskTitle,
            description: taskDescription,
            priority: taskPriorityValue,
            status: taskStatus,
            category: selectedCategory,
            created_at: createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            due_date: new Date().toISOString(),
        };
        if (taskContext) {
            if (id) {
                try{
                    newTask._id = id;
                    taskContext.updateTask(newTask);
                    console.log('Task Updated', newTask);
                }catch(error){}
            } else {
                try{
                    axios.post('http://localhost:8080/user/tasks', {
                        title: taskTitle,
                        description: taskDescription,
                        priority: taskPriorityValue,
                        status: taskStatus,
                        category: selectedCategory,
                        due_date: dueDate
                    },{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    })
                    .then((response) => {
                        console.log(response);
                        userid = response.data;
                        newTask._id = userid;
                        taskContext.addTask(newTask);
                        console.log('Task Added', newTask);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                }
                catch(error){
                    console.error('Error:', error);
                }
            }
            setSelectedCategory(taskType.Personal);
            setTaskTitle('');
            setTaskDescription('');
            setTaskPriorityValue(taskPriority.Low);
            setTaskStatus(TaskStatus.Backlog);
            setDueDate('');
            navigate(-1);
        }
    };

    const handleDelete = () => {
        if (id && taskContext) {
            taskContext.deleteTask(id);
            navigate(-1);
        }
    };

    const handleCategoryChange = (e: SelectChangeEvent<taskType>) => {
        setSelectedCategory(e.target.value as taskType);
    };

    const handlePriorityChange = (e: SelectChangeEvent<taskPriority>) => {
        setTaskPriorityValue(e.target.value as taskPriority);
    };

    const handleStatusChange = (e: SelectChangeEvent<TaskStatus>) => {
        setTaskStatus(e.target.value as TaskStatus);
    };

    return (
        <Container sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Box sx={{
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 5px #ccc',
                backgroundColor: '#fff',
            }}>
                <Box sx={{display:'flex'}}>
                    <IconButton
                        sx={{ m: 1, border: '1px solid' }}
                        color="primary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                <Typography variant="h4" textAlign={'center'} gutterBottom>{id ? 'Edit Task' : 'Add Task'}</Typography>
                <hr style={{ marginBottom: '20px' }} />
                <Box>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <InputLabel id="priority-label">Task Name</InputLabel>
                                <TextField
                                    placeholder="Title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    fullWidth
                                >
                                    <MenuItem value={taskType.Work}>Work</MenuItem>
                                    <MenuItem value={taskType.Study}>Study</MenuItem>
                                    <MenuItem value={taskType.Personal}>Personal</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={3}>
                                <InputLabel id="priority-label">Priority</InputLabel>
                                <Select
                                    labelId="priority-label"
                                    value={taskPriorityValue}
                                    onChange={handlePriorityChange}
                                    fullWidth
                                >
                                    <MenuItem value={taskPriority.Low}>Low</MenuItem>
                                    <MenuItem value={taskPriority.Medium}>Medium</MenuItem>
                                    <MenuItem value={taskPriority.High}>High</MenuItem>
                                </Select>
                            </Grid>
                            {id && (
                                <>
                                    <Grid item xs={4}>
                                        <Select
                                            labelId="status-label"
                                            value={taskStatus}
                                            onChange={handleStatusChange}
                                            fullWidth
                                        >
                                            <MenuItem value={TaskStatus.Backlog}>Backlog</MenuItem>
                                            <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
                                            <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
                                        </Select>
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
                                </>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    label='Due Date'
                                    type='date'
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label='Description'
                                    placeholder="Description"
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    value={taskDescription}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>

                            {id ? (
                                <Grid item xs={12}>
                                    <Button sx={{ m: 1, border: '1px solid' }} variant="outlined" color="primary" onClick={handleDelete}>
                                        Delete Task
                                    </Button>
                                    <Button sx={{ m: 1, border: '1px solid' }} variant="outlined" color="primary" type="submit">
                                        Update Task
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Button sx={{ m: 1, border: '1px solid' }} variant="outlined" color="primary" type="submit">
                                        Add Task
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default AddTask;