import React, { useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button,List, ListItem} from '@mui/material';
import { useState } from 'react';
import { WelcomeComponentProps } from '../../Types/Task';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useUserProfile } from '../../hooks/userProfileContext';

const WelcomeComponent: React.FC<WelcomeComponentProps> = ({setSelectedProject, setSelectedProjectId}) => {
    const { profile} = useUserProfile();
    const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if(profile) setProjects(profile?.projects|| []);
        // console.log('Projects:', profile?.projects);
    }, [profile]);

    const selectProjct = (project : {id: string, name: string}) => {
        setSelectedProject(project.name); 
        setSelectedProjectId(project.id);
        localStorage.setItem('selectedProject', project.name);
        localStorage.setItem('selectedProjectId',project.id); 
        navigate(project.name)
    }
    // const deleteProject = (project : {id: string, name: string}) => {
        
    // }

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <Box>
            <TextField 
                label="Search Projects" 
                variant="outlined" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                sx={{ marginBottom: '16px'}} 
                fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: '500' }}>Projects</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}  
                    onClick={() => navigate('project/add')}
                    sx={{
                    textTransform: 'none',  
                    padding: '8px 16px',
                    }}
                >
                    Add Project
                </Button>
            </Box> 
            <Box sx={{backgroundColor:'transparent' }}>
                <List sx={{display:'flex', flexDirection:'column', gap: '8px'}}>
                    {filteredProjects.map((project, index) => (
                    <Paper sx={{display:'flex', p:1}} key={index}>
                        <ListItem key={index}>
                            <Typography>{project.name}</Typography>
                        </ListItem>
                        <Button  variant='contained' onClick={() => {selectProjct(project);}}>Select</Button>
                    </Paper>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default WelcomeComponent;