import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from 'axios';
import useToken from "../../hooks/useToken";
import { useUserProfile } from '../../hooks/userProfileContext';

const AddProject: React.FC = () => {
    const { token } = useToken();
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectDeadline, setProjectDeadline] = useState('');
    const [existingProjects, setExistingProjects] = useState<{ id: string; name: string }[]>([]);
    const { profile, updateProjects } = useUserProfile();

    useEffect(() => {
        const fetchProjects = async () => {
            setExistingProjects(Array.isArray(profile?.projects) ? profile.projects : []);
        };
        fetchProjects();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (projectName === 'SELF') {
            alert("Project name cannot be SELF");
            return;
        }
        if (existingProjects.some(project => project.name === projectName)) {
            alert(`A project with the name "${projectName}" already exists.`);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/admin/project', {
                projectName:projectName,
                description: projectDescription,
                deadline: projectDeadline,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Project created with ID:', response.data);
            updateProjects([...existingProjects, {id: response.data._id, name: projectName}]);
            setProjectName('');
            setProjectDescription('');
            setProjectDeadline('');
            alert('Project created successfully');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <Box sx={{ padding: '16px' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Project Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    sx={{ marginBottom: '16px' }}
                />
                <TextField
                    label="Project Description"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    sx={{ marginBottom: '16px' }}
                />
                <TextField
                    label="Project Deadline"
                    variant="outlined"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={projectDeadline}
                    onChange={(e) => setProjectDeadline(e.target.value)}
                    sx={{ marginBottom: '16px' }}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default AddProject;
