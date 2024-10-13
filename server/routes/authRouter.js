const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const Task = require('../models/Task');

router.post('/register', register);
router.post('/login', login);
// router.put('/updateTasksProject', async (req, res) => {
//     try {
//         const tasks = await Task.find({});

//         const updatedTasks = tasks.map(async task => {
//             if (task.project == 'SELF') {
//                 task.project = { id: null, name: 'SELF' };
//             } else {
//                 task.project = { id: task.project, name: '' };
//             }
//             await task.save();
//         });

//         await Promise.all(updatedTasks);

//         res.status(200).send('All tasks have been updated with the new project structure.');
//     } catch (error) {
//         console.error('Error updating tasks:', error);
//         res.status(500).send('An error occurred while updating the tasks.');
//     }
// });
module.exports = router;