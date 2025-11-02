import React, { useState, useMemo, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent,
} from "@mui/material";

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd/src';

import ListComponents from './ListComponent';
import Board from './Board';
import AccountMenu from './AccountMenu';

import { TaskContext } from '../../hooks/TaskContext';
import { useUserProfile } from "../../hooks/userProfileContext";
import { Task } from '../../Types/Task';
import { useNavigate, useLocation } from "react-router-dom";


import './Home.css';

const Home: React.FC = () => {
  const taskContext = useContext(TaskContext);
  const { profile, setSelectedProjectContext, selectedProjectContext } = useUserProfile();

  const [viewType, setViewType] = useState<string | null>('Board');
  const [selectedProject, setSelectedProject] = useState<string>(selectedProjectContext || 'SELF');
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  if (!taskContext) {
    return <div>Task Context not found</div>;
  }

  const { tasks, updateStatus, deleteTask: deleteTaskContext } = taskContext;

  // Sync profile projects
  React.useEffect(() => {
    if (profile?.projects) {
      setProjects(profile.projects);
    }
    
  }, [profile]);

  // Filtered tasks based on selected project
  const currentTasks: Task[] = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('project', selectedProject);
    navigate(`?${searchParams.toString()}`);
    if (selectedProject === 'All') return tasks;
    return tasks.filter(task =>
      selectedProject === 'SELF'
      ? task.project?.name === "SELF" || !task.project
      : task.project?.name === selectedProject
    );
  }, [tasks, selectedProject]);

  // Handle project select change
  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    setSelectedProject(selected);
    setSelectedProjectContext(selected);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('project', selected);
    // navigate(`?${searchParams.toString()}`);
    window.location.replace(`${window.location.pathname}?${searchParams.toString()}`);
  };

  // Handle view toggle
  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewType: string | null
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Only allow deleting personal tasks
  const deleteTask = (id: string) => {
    if (selectedProject === 'SELF') {
      deleteTaskContext(id);
    } else {
      alert('You can only delete personal tasks');
    }
  };

  return (
    <Container sx={{ height: '100%' }}>
      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '95vw',
            height: '95%',
            overflow: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" margin={3} fontWeight={'bold'}>
              {viewType === "Board" ? "Board" : "List"}
            </Typography>

            <Box sx={{ padding: 2, display: 'flex', gap: '10px', height: '40px' }}>
              <Select
                name="Project"
                id="project"
                value={selectedProject}
                onChange={handleProjectChange}
                sx={{ maxWidth: '180px', minWidth: '120px' }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="SELF">Personal</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.name}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>

              <ToggleButtonGroup
                exclusive
                value={viewType}
                onChange={handleTypeChange}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ToggleButton value="Board">Board</ToggleButton>
                <ToggleButton value="List">List</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Main content */}
          <Box>
            {currentTasks.length === 0 ? (
              <Typography variant="body1" textAlign="center" mt={4}>
                No tasks found for this project.
              </Typography>
            ) : viewType === "Board" ? (
              <Board tasks={currentTasks} updateStatus={updateStatus} deleteTask={deleteTask} />
            ) : (
              <ListComponents tasks={currentTasks} />
            )}
          </Box>
        </Box>

        <AccountMenu tasks={currentTasks} project={selectedProject} />
      </DndProvider>
    </Container>
  );
};

export default Home;