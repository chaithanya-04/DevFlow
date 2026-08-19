import Groq from 'groq-sdk';
import Task from '../models/Task.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateTasks = async (req, res) => {
  try {
    const { description, projectId } = req.body;

    if (!description || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description and projectId'
      });
    }

    
    const prompt = `You are a senior software project manager. Based on the following project description, generate 5 to 8 specific development tasks.
    
    Project Description:
    "${description}"
    
    Return ONLY a valid JSON array. Do not include markdown formatting, explanations, or code blocks.
    
    Each object in the array must have exactly these fields:
    - title (string): a clear, actionable task title
    - priority (string): one of ["Low", "Medium", "High"]
    - difficulty (string): one of ["Easy", "Medium", "Hard"]
    - estimatedTime (string): e.g. "4 hours", "2 days", "1 week"
    
    Example output:
    [
    {
    "title": "Implement JWT authentication",
    "priority": "High",
    "difficulty": "Medium",
    "estimatedTime": "4 hours"
    }
    ]
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON arrays.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiContent = chatCompletion.choices[0]?.message?.content || '';

    let generatedTasks;
    try {
      const cleaned = aiContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      generatedTasks = JSON.parse(cleaned);

      if (!Array.isArray(generatedTasks)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('AI JSON Parse Error:', parseError.message);
      console.error('Raw AI response:', aiContent);
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid format. Please try again.'
      });
    }

    const validTasks = generatedTasks.filter(t => 
      t.title && t.priority && t.difficulty && t.estimatedTime
    );

    if (validTasks.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'AI generated empty or invalid tasks.'
      });
    }
    const createdTasks = [];
    for (const taskData of validTasks) {
      const task = await Task.create({
        title: taskData.title,
        description: `AI-generated task for: ${description.substring(0, 100)}...`,
        project: projectId,
        createdBy: req.user.userId,
        priority: taskData.priority,
        difficulty: taskData.difficulty,
        estimatedTime: taskData.estimatedTime,
        status: 'To Do'
      });
      createdTasks.push(task);
    }

    await Task.populate(createdTasks, { path: 'project', select: 'name' });

    res.status(201).json({
      success: true,
      count: createdTasks.length,
      data: createdTasks
    });

  } catch (error) {
    console.error('AI Generation Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI task generation failed',
      error: error.message
    });
  }
};
