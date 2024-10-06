const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.get('/', userController.getUserPage);

router.get('/profile', userController.getUserProfile);

router.get('/tasks', userController.getUserTasks);

router.get('/tasks/:id', userController.getUserTaskById);

router.post('/tasks', userController.createUserTask);

router.put('/tasks/:id', userController.updateUserTask);

router.delete('/tasks/:id', userController.deleteUserTask);

router.put('/tasks/:id/status', userController.updateTaskStatus);

router.put('/update-priority/:id', userController.updateTaskPriority);

router.get('/logout', userController.userLogout);

router.get('/taskspriority', userController.getUserTasksPriority);

module.exports = router;
