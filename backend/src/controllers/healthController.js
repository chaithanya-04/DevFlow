import Groq from 'groq-sdk';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getHealthScore = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const now = new Date();

    const totalTasks = await Task.countDocuments({ project: projectId });
    const completedTasks = await Task.countDocuments({ project: projectId, status: 'Done' });
    const pendingTasks = await Task.countDocuments({ project: projectId, status: { $ne: 'Done' } });
    const overdueTasks = await Task.countDocuments({
      project: projectId,
      dueDate: { $lt: now },
      status: { $ne: 'Done' }
    });
    const highPriorityPending = await Task.countDocuments({
      project: projectId,
      priority: 'High',
      status: { $ne: 'Done' }
    });

    const daysSinceCreation = Math.max(
      1,
      Math.ceil((now - project.createdAt) / (1000 * 60 * 60 * 24))
    );
    const taskCompletionRate = parseFloat((completedTasks / daysSinceCreation).toFixed(2));

    if (totalTasks === 0) {
      return res.status(200).json({
        success: true,
        data: {
          score: null,
          summary: 'No tasks found for this project. Add tasks to see a health score.',
          warnings: [],
          stats: { totalTasks, completedTasks, pendingTasks, overdueTasks, velocity }
        }
      });
    }

    const prompt = `You are a senior engineering manager analyzing a software project's health.
    Project Name: ${project.name}
    Project Deadline: ${project.deadline ? new Date(project.deadline).toDateString() : 'Not set'}
    Project Statistics:
    - Total Tasks: ${totalTasks}
    - Completed Tasks: ${completedTasks}
    - Pending Tasks: ${pendingTasks}
    - Overdue Tasks: ${overdueTasks}
    - High Priority Pending Tasks: ${highPriorityPending}
    - Task Completion Rate: ${taskCompletionRate} tasks completed per day
    - Days Since Project Created: ${daysSinceCreation}
    
    Based on these numbers, calculate a Project Health Score from 0 to 100.
    Then provide 0 to 3 specific, actionable warnings about risks or blockers.
    
    Return ONLY a valid JSON object in this exact format:
    {
    "score": number,
    "summary": "One sentence overall assessment",
    "warnings": ["Warning 1", "Warning 2"]
    }
    Do not include markdown, explanations, or code blocks.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You output only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.5,
      max_tokens: 800
    });

    const aiContent = chatCompletion.choices[0]?.message?.content || '';

    let aiResult;
    try {
      const cleaned = aiContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      aiResult = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Health Score Parse Error:', parseError.message);
      console.error('Raw response:', aiContent);
      aiResult = {
        score: Math.round(((completedTasks / totalTasks) * 0.7 + (overdueTasks === 0 ? 30 : 0)) * 100 / 100),
        summary: 'Project analysis completed.',
        warnings: overdueTasks > 0 ? [`${overdueTasks} task(s) are overdue.`] : []
      };
    }

    const clampedScore = Math.min(100, Math.max(0, aiResult.score || 0));

    res.status(200).json({
      success: true,
      data: {
        score: clampedScore,
        summary: aiResult.summary || 'Analysis complete.',
        warnings: Array.isArray(aiResult.warnings) ? aiResult.warnings : [],
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          highPriorityPending,
          taskCompletionRate
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health score analysis failed',
      error: error.message
    });
  }
};
