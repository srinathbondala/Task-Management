import React from "react";
import { Container, Box, Typography, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import { useNavigate, Routes, Route } from "react-router-dom";
import { DndProvider } from 'react-dnd/src';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddIcon from '@mui/icons-material/Add';
import Analytics from '../../pages/Analytics/Analytics';
import AddProject from "./AddProject";
import WelcomeComponent from "./WelcomeComponent";
import ProjectMainPage from "./projectPages/ProjectMainPage";
import { Explore } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddUser from "./projectPages/AddUser";
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserProfile } from "../../hooks/userProfileContext";
import AdminAddTask from "./adminTaskPages/AdminAddTask";
import useToken from "../../hooks/useToken";
import { useState } from "react";
import { Task } from "../../Types/Task";
import axios from "axios";
// import './Home.css'
const AdminHome:React.FC = () => {
    const { profile } = useUserProfile();
    const location = useLocation();
    const [selectedProject, setSelectedProject] = React.useState<string>(localStorage.getItem('selectedProject') || '');
    const [selectedProjectId, setSelectedProjectId] = React.useState<string>(localStorage.getItem('selectedProjectId') || '');
    const [heading, setHeading] = React.useState<string>('DashBoard');
    const [projects, setProjects] = React.useState<{ id: string; name: string; }[]>([]);
    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const token = useToken().token;
    
    React.useEffect(() => {
        setProjects(profile?.projects || []);
    }, [profile]);
    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/projects/tasks/${selectedProject}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.message==='No tasks found for this project'){
                    setCurrentTasks([]);
                    console.log(response.data.message);
                }
                else{
                    setCurrentTasks(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                // console.error("Error fetching tasks: ", error);
                alert('Project does not exist');
            }
        };
    if(token && selectedProject!=='') fetchTasks();
    },[selectedProject]);

    React.useEffect(() => {
        if (location.pathname === '/admin/dashboard') {
            setHeading('DashBoard');
        } 
    }, [location.pathname]);

    const handleProjectChange = (event: SelectChangeEvent<string>) => {
        const project = event.target.value as string;
        setSelectedProject(project);
        const projectId = projects.find((proj) => proj.name == project)?.id || '';
        setSelectedProjectId(projectId);
        localStorage.setItem('selectedProject', project);
        localStorage.setItem('selectedProjectId', projectId);
        navigate('/admin/dashboard/'+project);
    };

    const updateTask = (updatedTask: Task) => {
       setCurrentTasks((prevTasks) => {
           return prevTasks.map((task) =>
               task._id === updatedTask._id ? updatedTask : task
           );
       });
    }

    const addTask = (newTask: Task) => {
        setCurrentTasks((prevTasks) => {
            return [...prevTasks, newTask];
        });
    }

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
                        <Box sx={{display:'flex', alignItems:'center'}}>
                            <IconButton
                                sx={{ border: '1px solid' , height:'25px', width:'25px'}}
                                color="primary"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" margin={3} fontWeight={'bold'} onClick={()=>{
                                navigate(`/admin/dashboard/${heading}`);    
                            }}>{heading}</Typography>
                        </Box>
                        <Box sx={{padding:2, display:'flex', gap:'10px',height:'40px'}}>
                            {
                                selectedProject !== '' && (
                                    <>
                                        <Select
                                            name="Project"
                                            id="project"
                                            value={selectedProject}
                                            onChange={handleProjectChange}
                                            sx={{ maxWidth: '180px', minWidth: '120px' }}
                                        >
                                            {/* show all projects from holder*/}
                                            {
                                                projects.map((project, index) => {
                                                    if(project.name === 'SELF') {
                                                        return (
                                                            <MenuItem key={index} value={project.name}>Personal</MenuItem>
                                                        )
                                                    }
                                                    else{
                                                        return (<MenuItem key={index} value={project.name}>{project.name}</MenuItem>)
                                                    }
                                                })
                                            }
                                            {/* <MenuItem value="SELF">Personal</MenuItem>
                                            <MenuItem value="Project X">Project X</MenuItem>
                                            <MenuItem value="Project Y">Project Y</MenuItem> */}
                                        </Select>
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={() => {navigate(`${selectedProject}/addtask`);}}
                                            sx={{
                                                textTransform: 'none',
                                                padding: '8px 16px',
                                            }}
                                        >Add Task</Button>
                                         {selectedProject !='SELF' && (<Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<AccountCircleIcon />}
                                            onClick={() => {navigate(`${selectedProject}/adduser`);}}
                                            sx={{
                                                textTransform: 'none',
                                                padding: '8px 16px',
                                            }}
                                        >Add User</Button>)
                                        }
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<Explore />}
                                            onClick={() => navigate(`${selectedProject}/analytics`)}
                                            sx={{
                                                textTransform: 'none',
                                                padding: '8px 16px',
                                            }}
                                        >Analytics</Button>
                                    </>
                                )
                            }
                        </Box>
                    </Box>
                    <Box>
                        <Routes>
                            <Route path="/" element={<WelcomeComponent setSelectedProject = {setSelectedProject} setSelectedProjectId={setSelectedProjectId}/>} />
                            <Route path="/:project" element={< ProjectMainPage selectedProject = {selectedProject} currentTasks = {currentTasks} setCurrentTasks = {setCurrentTasks}/>} />
                            <Route path="/project/add" element={<AddProject />} />
                            <Route path="/:project/analytics" element={<Analytics />} />
                            <Route path="/all/list" element={<>all pages</>} />
                            <Route path="/:project/addtask/" element={<AdminAddTask updateTask = {addTask} projectId = {selectedProjectId} projectName= {selectedProject}/>} />
                            <Route path="/:project/edit/:id" element={<AdminAddTask tasks = {currentTasks} updateTask = {updateTask} projectId = {selectedProjectId} projectName= {selectedProject}/>} />
                            <Route path="/:project/adduser/" element={<AddUser projectId={selectedProjectId}/>} />
                            <Route path="*" element={<>404</>} />
                        </Routes>
                    </Box>
                </Box>
                {/* <AccountMenu tasks={currentTasks} /> */}
            </DndProvider>
        </Container>
    );
};

export default AdminHome;