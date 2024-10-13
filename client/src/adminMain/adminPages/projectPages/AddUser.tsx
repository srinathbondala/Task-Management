import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, Button, IconButton, Checkbox, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useToken from '../../../hooks/useToken';

interface User {
    email: string;
    id: string;
}

const AddUser: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [existingUsers, setExistingUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { token } = useToken();

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/project-all/${projectId}/users`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setExistingUsers(data.projectUsers);
            setAllUsers(data.remainingUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const addUsersToProject = async (projectId: string, userIds: string[]) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/projects/add-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId, userIds }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add users to project');
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error adding users to project:', error);
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, [projectId]);

    const handleRemoveUser = (email: string) => {
        setExistingUsers(existingUsers.filter(user => user.email !== email));
    };

    const handleToggleUserSelection = (email: string) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter(user => user !== email));
        } else {
            setSelectedUsers([...selectedUsers, email]);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddUsers = () => {
        // addUsersToProject(projectId, selectedUsers);
        const usersToAdd = allUsers.filter(user => selectedUsers.includes(user.email));
        setExistingUsers([...existingUsers, ...usersToAdd]);

        setSelectedUsers([]);
    };

    const filteredUsers = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: '16px' }}>
            <Paper elevation={3} sx={{ padding: '16px', marginBottom: '24px' }}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>Existing Users</Typography>
                <hr />
                <List>
                    {existingUsers.map((user, index) => (
                        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>{user.email}</Typography>
                            <IconButton edge="end" onClick={() => handleRemoveUser(user.email)}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper elevation={3} sx={{ padding: '16px' }}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>Add Users to Project</Typography>
                <TextField
                    label="Search Users"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: '16px' }}
                    fullWidth
                />
                <List>
                    {filteredUsers.map((user, index) => (
                        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>{user.email}</Typography>
                            <Checkbox
                                checked={selectedUsers.includes(user.email)}
                                onChange={() => handleToggleUserSelection(user.email)}
                            />
                        </ListItem>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddUsers}
                    disabled={selectedUsers.length === 0}
                    sx={{ marginTop: '16px' }}
                >
                    Add Selected Users
                </Button>
            </Paper>
        </Box>
    );
};

export default AddUser;
