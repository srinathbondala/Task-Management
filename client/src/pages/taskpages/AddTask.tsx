import React, { useEffect, useContext, useState } from "react";
import { Alert, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { taskType, taskPriority, TaskStatus, Task } from "../../Types/Task";
import { useParams } from "react-router-dom";
import { TaskContext } from "../../hooks/TaskContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/userProfileContext";
import axios from "axios";
import useToken from "../../hooks/useToken";
import DueDatePicker from "../../Helpers/DueDatePicker";
import SuccessSnackbar from "../../Helpers/SuccessSnackbar";
import { isFormDetailsValid } from "../../Utility/util";
import AddTaskHeader from "./taskPageHeader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const { token } = useToken();
    const { selectedProjectContext } = useUserProfile();
    const isReadonly = selectedProjectContext !== "SELF"? true: false;
    const [currentTask, setCurrentTask] = React.useState<Task | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (id && taskContext) {
            const task = taskContext.tasks.find(task => task._id == id);
            if (task) {
                setCurrentTask(task);
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
    
    const handleOpen = () => setOpen(true);
    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        let userid : string = "";
        e.preventDefault();
        if(!isFormDetailsValid({
            title: taskTitle,
            description: taskDescription,
            priority: taskPriorityValue,
            status: taskStatus,
            category: selectedCategory,
            due_date: dueDate
        })){
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
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
            if (id && currentTask) {
                try{
                    const updatedTask: Task = {
                        ...currentTask,
                        title: taskTitle,
                        description: taskDescription,
                        priority: taskPriorityValue,
                        status: taskStatus,
                        category: selectedCategory,
                        updated_at: new Date().toISOString(),
                        due_date: dueDate ? new Date(dueDate).toISOString() : currentTask.due_date,
                    };
                    updatedTask._id = id;
                    taskContext.updateTask(updatedTask);
                    handleOpen();
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
                        taskContext.addTask(response.data);
                        handleOpen();
                        setSelectedCategory(taskType.Personal);
                        setTaskTitle('');
                        setTaskDescription('');
                        setTaskPriorityValue(taskPriority.Low);
                        setTaskStatus(TaskStatus.Backlog);
                        setDueDate('');
                        navigate(-1);
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
            if(id && taskContext){
            taskContext.updateStatus(id,e.target.value as TaskStatus);
        }
    };

    return (
        <Container sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Box sx={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 5px #ccc',
                backgroundColor: '#fff',
                // margin: '20px'
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
                {id ? (
                <AddTaskHeader 
                    heading="Edit Task"
                    taskStatus={taskStatus}
                    handleStatusChange={handleStatusChange}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}   
                />) : (<Typography variant="h5" textAlign={'center'} gutterBottom>Add Task</Typography>)}
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
                                        disabled={isReadonly}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        fullWidth
                                        disabled={isReadonly}
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
                                        disabled={isReadonly}
                                    >
                                        <MenuItem value={taskPriority.Low}>Low</MenuItem>
                                        <MenuItem value={taskPriority.Medium}>Medium</MenuItem>
                                        <MenuItem value={taskPriority.High}>High</MenuItem>
                                    </Select>
                                </Grid>
                                {id && (
                                    <>
                                        <Grid item xs={4}>
                                            <DueDatePicker
                                                dueDate={dueDate}
                                                setDueDate={setDueDate}
                                                isReadonly={isReadonly}
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
                                    </>
                                )}
                                {!id &&
                                <Grid item xs={12}>
                                    <DueDatePicker
                                        dueDate={dueDate}
                                        setDueDate={setDueDate}
                                        isReadonly={isReadonly}
                                    />
                                </Grid> }
                                <Grid item xs={12}>
                                    {/* <TextField
                                        label='Description'
                                        placeholder="Description"
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        value={taskDescription}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                        disabled={isReadonly}
                                    /> */}
                                    <ReactQuill
                                        theme="snow"
                                        value={taskDescription}
                                        onChange={setTaskDescription}
                                        readOnly={isReadonly}
                                        placeholder="Enter task description..."
                                        modules={{
                                        toolbar: [
                                            [{ header: [1, 2, 3, false] }],
                                            ["bold", "italic", "underline", "strike"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["link", "image", "code-block"],
                                            ["clean"]
                                        ]
                                        }}
                                    />
                                </Grid>

                                {id? (
                                    <Grid item xs={12}>
                                        {selectedProjectContext === "SELF" && (
                                            <><Button sx={{ m: 1, border: '1px solid' }} variant="outlined" color="error" onClick={handleDelete} disabled={isReadonly}>
                                                Delete Task
                                            </Button><Button sx={{ m: 1, border: '1px solid' }} variant="outlined" color="primary" type="submit" disabled={isReadonly}>
                                                Update Task
                                            </Button></>
                                        )
                                    }
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
            <SuccessSnackbar open={open} onClose={handleClose} message={id ? "Task Updated Successfully!" : "Task Added Successfully!"} />
            {showAlert && (
                <Alert severity="warning">Enter Complete Data</Alert>
            )}
        </Container>
    );
};

export default AddTask;