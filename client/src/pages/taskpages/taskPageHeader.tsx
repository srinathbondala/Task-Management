import React from "react";
import { Box, Typography, Select, MenuItem, IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { AddTaskHeaderProps, TaskStatus } from "../../Types/Task";
import LinkIcon from "@mui/icons-material/Link";
import { handleCopyLink } from "../../Utility/util";

const AddTaskHeader: React.FC<AddTaskHeaderProps> = ({
    heading,
    taskStatus,
    handleStatusChange,
    isPlaying,
    onTogglePlay,
    refLink,
}) => {

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 1,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
        <Typography
            variant="h5"
            textAlign="center"
            sx={{ flex: 1 }}
        >
            {heading}
            <Tooltip title="Copy application link">
              <IconButton 
                sx={{
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: "scale(1.05)",
                  }}}
                  onClick={() => {handleCopyLink(refLink ?? '')}}>
                <LinkIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Select
            labelId="status-label"
            value={taskStatus as TaskStatus}
            onChange={handleStatusChange}
            fullWidth
            sx={{
                minWidth: {
                xs: 100,  
                sm: 150,  
                md: 200,  
                }
            }}
        >
            <MenuItem value={TaskStatus.Backlog}>Backlog</MenuItem>
            <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
            <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
        </Select>

        {/* Play / Pause toggle */}
        <IconButton color="primary" onClick={onTogglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default AddTaskHeader;
