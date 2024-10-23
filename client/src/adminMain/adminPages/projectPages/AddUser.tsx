import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, Button, IconButton, Checkbox, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useToken from '../../../hooks/useToken';
import { useNavigate } from 'react-router-dom';

interface User {
    email: string;
    id: string;
}

const AddUser: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [existingUsers, setExistingUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);  // Prevent duplicate submission
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Handle errors
    const { token } = useToken();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/project-all/${projectId}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            setExistingUsers(data.projectUsers);
            setAllUsers(data.remainingUsers);
        } catch (error) {
            setErrorMessage('Failed to fetch users');
        }
    };

    const addUsersToProject = async (userIds: string[]) => {
        setIsSubmitting(true); // Prevent multiple submissions
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
                throw new Error('Failed to add users');
            }

            // Optimistic UI update: Add the selected users to the existing user list instantly
            const usersToAdd = allUsers.filter(user => selectedUsers.includes(user.email));
            setExistingUsers([...existingUsers, ...usersToAdd]);
            setAllUsers(allUsers.filter(user => !selectedUsers.includes(user.email)));
            setSelectedUsers([]); // Reset selection
        } catch (error) {
            setErrorMessage('Failed to add users to project');
        } finally {
            setIsSubmitting(false); // Enable submission again
        }
    };

    const deleteUsersFromProject = async (userId: string, email: string) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/admin/project/remove-user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId, userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove user');
            }

            // Optimistic UI update: Remove the user from the existing user list instantly
            setExistingUsers(existingUsers.filter(user => user.email !== email));
            setAllUsers([...allUsers, { email, id: userId }]);
        } catch (error) {
            setErrorMessage('Failed to remove user from project');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (projectId === '123') {
            navigate('/admin/dashboard');
        }
        fetchUsers();
    }, [projectId]);

    const handleToggleUserSelection = (email: string) => {
        setSelectedUsers(prev =>
            prev.includes(email) ? prev.filter(user => user !== email) : [...prev, email]
        );
    };

    const handleAddUsers = () => {
        if (isSubmitting) return; // Prevent multiple submissions
        const userIds = allUsers
            .filter(user => selectedUsers.includes(user.email))
            .map(user => user.id);
        addUsersToProject(userIds);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
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
                            <IconButton
                                edge="end"
                                onClick={() => deleteUsersFromProject(user.id, user.email)}
                                disabled={isSubmitting} // Prevent while submitting
                            >
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
                    disabled={selectedUsers.length === 0 || isSubmitting} // Disable while submitting
                    sx={{ marginTop: '16px' }}
                >
                    Add Selected Users
                </Button>
            </Paper>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />
        </Box>
    );
};

export default AddUser;
