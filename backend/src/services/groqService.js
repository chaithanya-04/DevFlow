import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateTaskWithAI = async (description) => {
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',

    messages: [
      {
        role: 'system',
        content: `
        You are an AI task generator for a developer project management application.
        Convert the user's project description into ONE software development task.
        Return ONLY valid JSON with exactly these fields:
        {
        "title": "string",
        "priority": "Low | Medium | High",
        "difficulty": "Easy | Medium | Hard",
        "estimatedTime": "string"
        }
        Rules:
        - Create one clear and actionable development task.
        - Priority must be Low, Medium, or High.
        - Difficulty must be Easy, Medium, or Hard.
        - estimatedTime must be realistic, such as "4 hours", "1 day", or "2-3 days".
        - Do not return markdown.
        - Do not return explanations.
        - Do not return additional fields.`
      },
      {
        role: 'user',
        content: description
      }
    ],

    response_format: {
      type: 'json_object'
    },

    temperature: 0.4
  });

  return JSON.parse(completion.choices[0].message.content);
};