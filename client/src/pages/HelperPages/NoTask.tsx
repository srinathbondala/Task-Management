import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { NoTaskProps } from '../../Types/HelperTypes';

const NoTask: React.FC<NoTaskProps> = ({
  message = "No tasks found",
  showAddButton = true,
  addTaskPath = "/"
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '60vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        color: 'text.secondary',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60 }} color="disabled" />
      <Typography variant="h6">{message}</Typography>
      {showAddButton && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(addTaskPath)}
        >
          Add New Task
        </Button>
      )}
    </Box>
  );
};

export default NoTask;
