import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Task } from '../../Types/Task';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import React from 'react';

interface AccountMenuProps {
    tasks: Task[];
}

const AccountMenu:React.FC<AccountMenuProps> = ({tasks}) => {
    
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTasks, setFilteredTasks] = useState(tasks);

    const handleSave = () => {
        console.log("Save Changes clicked");
    };
    
    const handleEdit = () => {
        console.log("Edit Task clicked");
        setOpenDialog(true);
    };
    
    const handleAdd = () => {
        console.log("Add Task clicked");
        navigate('addtask');
    };
    
    const handleShare = () => {
        console.log("Share clicked");
    };
    
    const actions = [
        { icon: <SaveIcon />, name: 'Save Changes', handler: handleSave },
        { icon: <EditIcon />, name: 'Edit Task', handler: handleEdit },
        { icon: <AddIcon />, name: 'Add Task', handler: handleAdd },
        { icon: <ShareIcon />, name: 'Share', handler: handleShare },
    ];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(searchValue)
        );
        setFilteredTasks(filtered);
    };

    const handleTaskSelect = (taskId: number) => {
        navigate(`edit/${taskId}`);
        setOpenDialog(false);
    };

    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial openIcon example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon openIcon={<EditIcon />} />}>
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.handler}
                    />
                ))}
            </SpeedDial>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Select a Task to Edit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search Task by Name"
                        fullWidth
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <List>
                        {filteredTasks.map((task) => (
                            <ListItem
                            key={task.id}
                            component="li"
                            sx={{ cursor: 'pointer' , '&:hover': {backgroundColor: 'lightgray'}}}
                            onClick={() => handleTaskSelect(task.id)}
                            >
                                <ListItemText primary={task.title} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AccountMenu;