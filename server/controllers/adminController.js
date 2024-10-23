const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const addProject = async (req, res) => {
    try {
        if (req.body.projectName == 'SELF') {
            return res.status(400).send('Project name cannot be SELF');
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const existingProject = await Project.findOne({ name: req.body.projectName, created_by: userId });
        if (existingProject) {
            return res.status(400).send('Project with this name already exists');
        }
        const projectData = { ...req.body, created_by: userId };
        const newProject = await Project.create(projectData);
        await User.findByIdAndUpdate(userId, {
            $addToSet: { projects: { id: newProject._id, name: newProject.projectName } }
        });
        res.status(201).json({_id:newProject._id});
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const getProjects = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const projects = await Project.find().where('created_by').equals(userId);
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate('tasks');
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getProjectByName = async (req, res) => {
    try {
        const { projectName } = req.params;
        const project = await Project.findOne({ projectName: projectName });
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).json(project);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getProjectTasksByName = async (req, res) => {
    try {
        const { projectName } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        if (projectName === 'SELF') {
            const tasks = await Task.find({ user: userId });
            return res.status(200).json(tasks);
        }
        const project = await Project.find({projectName: projectName});
        if(!project.length){
            return res.status(404).send('Project not found');
        }
        const tasks = await Task.find({  'project.name': projectName, assigned_by: userId });
        if (!tasks.length) {
            return res.status(200).json({ message: 'No tasks found for this project' });
        }
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const addUserToProject = async (req, res) => {
    const { projectId, userId } = req.body;
    try {
        const [project, user] = await Promise.all([
            Project.findById(projectId),
            User.findById(userId)
        ]);

        if (!project) {
            return res.status(404).send('Project not found');
        }
        if (!user) {
            return res.status(404).send('User not found');
        }
        await Promise.all([
            Project.findByIdAndUpdate(
                projectId,
                { $addToSet: { users: user._id } }
            ),
            User.findByIdAndUpdate(
                userId,
                { $addToSet: { projects: { id: project._id, name: project.name } } } 
            )
        ]);
        res.status(200).send('User added to project successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getUsersInProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // console.log(projectId);
        const project = await Project.findById(projectId).populate('users', 'email , _id');
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).json(project.users);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createTask = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const AdminId = decoded.id;
        const { title, description, due_date, priority, projectId, projectName, userId } = req.body;

        const projectObjectId = mongoose.Types.ObjectId.isValid(projectId) ? new mongoose.Types.ObjectId(projectId) : null;
        if(projectObjectId == null && projectName == 'SELF'){
            const newTask = await Task.create({
                user: AdminId,
                title: title,
                description: description,
                due_date: due_date,
                category: 'work',
                priority: priority,
                project: { id: projectObjectId, name: projectName },
                assigned_by: null
            });
            await User.findByIdAndUpdate(AdminId, { $push: { tasks: newTask._id } });
            res.status(201).json(newTask._id);
        }
        else{
            const newTask = await Task.create({
                user: userId || null,
                title: title,
                description: description,
                due_date: due_date,
                category: 'work',
                priority: priority,
                project: { id: projectId, name: projectName },
                assigned_by: AdminId
            });
            if (userId != null) {
                await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
            }
            await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });
            res.status(201).json(newTask._id);
        }
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const assignTaskToUser = async (req, res) => {
    try {
        const { taskId, userId } = req.body;
        const task = await Task.findById(taskId);
        task.user = userId;
        await task.save();
        await User.findByIdAndUpdate(userId, { $push: { tasks: taskId } });
        res.status(200).send('Task assigned to user successfully');
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (deletedTask.user) {
            await User.findByIdAndUpdate(deletedTask.user, { $pull: { tasks: id } });
        }

        if (deletedTask.project.id) {
            await Project.findByIdAndUpdate(deletedTask.project.id, { $pull: { tasks: id } });
        }

        res.status(204).json({ msg: 'Task deleted successfully' });
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTaskById = async (req, res) => {
    try {
        const tasks = await Task.findOne({ _id: req.params.id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const changeTaskStatus = async (req, res) => {
    try {
        const { taskId, status } = req.body;
        const task = await Task.findById(taskId);
        task.status = status;
        await task.save();
        res.status(200).send('Task status updated successfully');
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, due_date, priority, userId } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        const previousUserId = task.user;

        task.title = title;
        task.description = description;
        task.due_date = due_date;
        task.priority = priority;

        if (userId === null) {
            if (previousUserId) {
                await User.findByIdAndUpdate(previousUserId, { $pull: { tasks: id } });
            }
            task.user = null;
        } else {
            if (previousUserId !== userId) {
                if (previousUserId) {
                    await User.findByIdAndUpdate(previousUserId, { $pull: { tasks: id } });
                }
                await User.findByIdAndUpdate(userId, { $push: { tasks: id } });
            }
            task.user = userId;
        }

        await task.save();
        res.status(200).send('Task updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        await project.deleteOne();
        await User.updateMany({ projects: { $elemMatch: { id: projectId } } }, { $pull: { projects: { id: projectId } } });
        await Task.deleteMany({ 'project.id': projectId });
        console.log('Project deleted successfully');
        res.status(200).send('Project deleted successfully');
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const removeUserFromProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;
        const project = await Project.findById(projectId);
        const user = await User.findById(userId);
        project.users.pull(user._id);
        user.projects.pull({ id: projectId, name: project.name });
        await user.save();
        await project.save();
        res.status(200).send('User removed from project successfully');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const addMultipleUsersToProject = async (req, res) => {
    try {
        const { projectId, userIds } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length !== userIds.length) {
            return res.status(404).send('Some users not found');
        }
        await Promise.all(users.map(async (user) => {
            project.users.push(user._id);
            user.projects.push({ id: project._id, name: project.projectName });
            // console.log(project);
            await user.save();
        }));
        await project.save();
        res.status(200).send('Users added to project successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const getUsersEmailsAndIdsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        const project = await Project.findById(projectId).populate('users', 'email _id');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const allUsers = await User.find({}, 'email _id').where('role').ne('admin');

        const projectUsers = project.users.map(user => ({
            email: user.email,
            id: user._id,
        }));

        const remainingUsers = allUsers
            .filter(user => !project.users.some(projectUser => projectUser._id.equals(user._id)))
            .map(user => ({
                email: user.email,
                id: user._id,
            }));

        // console.log('projectUsers:', projectUsers);
        // console.log('remainingUsers:', remainingUsers);
        // console.log('-----------------------------------------');
        res.status(200).json({
            projectUsers,
            remainingUsers,
        });
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getTaskCompletions = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const registeredTasks = await Task.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    created_at: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    registeredCount: { $sum: 1 },
                },
            },
            {
                $sort: { "_id": 1 },
            },
            {
                $limit: 7,
            }
        ]);

        const completedTasks = await Task.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    status: "completed",
                    updated_at: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updated_at" } },
                    completedCount: { $sum: 1 },
                },
            },
            {
                $sort: { "_id": 1 },
            },
            {
                $limit: 7,
            }
        ]);

        const completions = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const response = {
            registeredTasks,
            completedTasks,
            completions,
        };
        // console.log(registeredTasks);
        // console.log("-------------------------------")
        // console.log(completedTasks);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    getProfile,
    addProject,
    getProjects,
    getProjectById,
    getProjectTasksByName,
    addUserToProject,
    getUsersInProject,
    createTask,
    assignTaskToUser,
    changeTaskStatus,
    deleteTask,
    deleteProject,
    removeUserFromProject,
    editTask,
    addMultipleUsersToProject,
    getProjectByName,
    getUsersEmailsAndIdsByProjectId,
    getTaskById,
    getTaskCompletions,
}