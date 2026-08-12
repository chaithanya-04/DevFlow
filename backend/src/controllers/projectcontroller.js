import Project from "../models/Project";

export const createProject = (req, res) => {
    try{
        const { name, description, startdate, deadline, teamMembers, status} = req.body;

        const project = await Project.create({
            name, Description, StartDate, Deadline,
            owner: req.user.userId,
            teamMembers: teamMembers || [],
            status
        });

        await project.populate('owner', 'name email')

        res.status(201).json({
        success: true,
        data: project
        });
    }
    catch(error){
        res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
    }
};