const Project = require('../models/Project');

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId || req.body.projectId;

  const hasAccess = await Project.exists({
    _id: projectId,
    users: userId,
  });

  if (!hasAccess) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
};
