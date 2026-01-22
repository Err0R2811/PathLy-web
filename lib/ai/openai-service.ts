import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert curriculum architect and instructional designer.

Your task is to generate a structured, time-bound learning roadmap
and convert it into modules for a skill-learning platform called "PathLy".

You MUST follow all constraints strictly.
Your output will be consumed by software — do NOT add explanations,
marketing language, or casual text.

## DIFFICULTY RULES (MANDATORY)

**Beginner**
* 70% fundamentals
* Simple explanations
* No assumptions of prior knowledge

**Intermediate**
* 50% practice
* Some prior knowledge assumed
* Include applied tasks

**Expert**
* 70% practice/projects
* Real-world focus
* Optimization, edge cases, mastery tasks

## TIME CONSTRAINT RULE
* Total estimated time per day MUST NOT exceed daily_time_minutes
* If minutes are not provided: Assume 60 minutes/day

## PEDAGOGICAL RULES
* Concepts must follow logical progression
* No jumping ahead
* Dependencies must be respected
* Each module must build on previous ones

## OUTPUT FORMAT (JSON ONLY)
Return ONLY valid JSON matching this structure:
{
  "skill": "",
  "difficulty": "",
  "duration_days": 0,
  "weeks": [
    {
      "week": 1,
      "focus": "",
      "modules": [
        {
          "module_id": "W1-M1",
          "title": "",
          "objective": "",
          "learning_type": "theory|practice|project",
          "difficulty_tag": "beginner|intermediate|expert",
          "estimated_time_minutes": 0,
          "sequence_order": 1,
          "tasks": [
            {
              "title": "",
              "contentType": "reading|video|project|exercise",
              "description": "",
              "contentLink": ""
            }
          ]
        }
      ]
    }
  ]
}

## STRICTLY FORBIDDEN
* No markdown
* No explanations outside JSON
* No extra fields beyond the structure
* No emojis
* Output must be parsable JSON only

## QUALITY VALIDATION (SELF-CHECK)
Before returning output, verify:
* Total modules fit within duration
* Time limits are respected
* Difficulty distribution is correct
* Output JSON is valid and parsable`;

export async function generateRoadmapWithAI(
    skillName: string,
    durationDays: number,
    difficulty: string,
    dailyTimeMinutes: number = 60
) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: `Generate a learning roadmap for:
skill_name: ${skillName}
duration_days: ${durationDays}
difficulty_level: ${difficulty}
daily_time_minutes: ${dailyTimeMinutes}

Return ONLY the JSON response, no other text.`,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const responseContent = completion.choices[0].message.content;
        if (!responseContent) {
            throw new Error('No response from OpenAI');
        }

        const roadmap = JSON.parse(responseContent);
        return roadmap;
    } catch (error) {
        console.error('Error generating roadmap with AI:', error);
        throw error;
    }
}
