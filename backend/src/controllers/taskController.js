import Task from "../models/Task.js";

export const createTask = async(req, res) =>{
    try{
        const { title, description, project, priority, difficulty, estimatedTime, dueDate } = req.body;
        if(!title || !project){
            return res.status(400).json({
                success:false,
                message: "Kindly provide the title and project"
            });
        }

        const task = await Task.create({
            title,
            description: description || '',
            project,
            createdBy: req.user.userId,
            priority: priority || 'Medium',
            difficulty: difficulty || 'Medium',
            estimatedTime: estimatedTime || '',
            dueDate: dueDate || null
        });
        await task.populate('project', 'name');
        await task.populate('createdBy', 'name email');
        
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


export const getTasks = async(req,res)=> {
    try{
        let filter = {};

        if(req.user.role === 'Developer'){
        filter.assignedTo = req.user.userId;
        }

        if(req.query.project){
            filter.project = req.query.project;
        }

        const task = await Task.find(filter)
        .populate('project', 'name')
        .populate('assignedTo', 'name email role')
        .populate('createdBy', 'name email')
        .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    };

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { title, description, priority, difficulty, estimatedTime, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, difficulty, estimatedTime, dueDate },
      { new: true, runValidators: true }
    ).populate('project', 'name')
     .populate('assignedTo', 'name email')
     .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email role')
     .populate('project', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    if (status === 'Done') {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
     .populate('project', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};