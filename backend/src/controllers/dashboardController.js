import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getStats = async (req, res) => {
  try {
    const now = new Date();

    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Done' });
    const pendingTasks = await Task.countDocuments({ status: { $ne: 'Done' } });

    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const highPriorityTasks = await Task.countDocuments({ priority: 'High', status: { $ne: 'Done' } });
    const overdueTasks = await Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Done' } });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage,
        highPriorityTasks,
        overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
