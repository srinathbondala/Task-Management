import React from "react";
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
} from "@mui/material";
import { Task } from "../Types/Task";
import { TaskSelectDialogProps } from "../Types/HelperTypes";

const TaskSelectDialog: React.FC<TaskSelectDialogProps> = ({
  open,
  onClose,
  tasks,
  title = "Select a Task",
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(tasks);

  React.useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredTasks(
      tasks.filter((task) =>
        task.title.toLowerCase().includes(value)
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

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
              key={task._id}
              component="li"
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onClick={() => onSelect(task._id)}
            >
              <ListItemText primary={task.title} />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskSelectDialog;
