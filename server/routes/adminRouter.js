const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// User profile route
router.get('/profile', adminController.getProfile);

// Project routes
router.post('/project', adminController.addProject); // Create a new project
router.get('/projects', adminController.getProjects); // Get all projects for the user
router.get('/projects/:id', adminController.getProjectById); // Get project by ID
router.get('/projects/:name', adminController.getProjectByName); // Get project by name
router.delete('/projects/:id', adminController.deleteProject); // Delete a project

// Project tasks route
router.get('/projects/tasks/:projectName', adminController.getProjectTasksByName); // Get tasks by project name

// User management in projects
router.post('/projects/add-user', adminController.addUserToProject); // Add a user to a project
router.get('/projects/:projectId/users', adminController.getUsersInProject); // Get users in a specific project
router.get('/project-all/:projectId/users', adminController.getUsersEmailsAndIdsByProjectId); //// Route to get users' emails and IDs by project ID
router.delete('/projects/remove-user', adminController.removeUserFromProject); // Remove a user from a project
router.post('/projects/add-users', adminController.addMultipleUsersToProject); // Add multiple users to a project

// Task management
router.post('/task', adminController.createTask); // Create a new task
router.post('/task/assign', adminController.assignTaskToUser); // Assign a task to a user
router.put('/task/status', adminController.changeTaskStatus); // Change task status
router.delete('/task/:id', adminController.deleteTask); // Delete a task
router.put('/tasks/:id', adminController.editTask); // Update a task

module.exports = router;
