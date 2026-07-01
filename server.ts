import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to lazily initialize GoogleGenAI with proper validation
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY matches placeholder or is not configured. Please add your real key in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. AI Grading and Correction Endpoint
app.post('/api/gemini/grade', async (req, res) => {
  try {
    const { type, prompt, submissionText, explanatoryLanguage } = req.body;

    if (!type || !prompt || !submissionText) {
      res.status(400).json({ error: 'Missing required fields: type, prompt, submissionText' });
      return;
    }

    const ai = getGeminiClient();

    let langName = 'Persian (Farsi)';
    if (explanatoryLanguage === 'en') langName = 'English';
    if (explanatoryLanguage === 'it') langName = 'Italian';

    const systemInstruction = `You are an expert Italian CILS B1 examiner. Your task is to evaluate and grade student answers for the CILS B1 citizenship exam.
- The evaluation and explanations MUST be written in ${langName}.
- Be encouraging, but maintain official B1 CILS standards.
- Calculate a score out of 20.
- Provide a clear breakdown of mistakes, grammar corrections, vocabulary tips, and overall advice.
- Return the output in JSON format with exactly two properties: "score" (a number 0-20) and "feedback" (a string containing well-formatted Markdown).`;

    const userPrompt = `
EXAM TYPE: ${type.toUpperCase()}
PROMPT GIVEN TO STUDENT:
"${prompt}"

STUDENT SUBMISSION:
"${submissionText}"

Please grade this submission out of 20. Mark spelling, grammar, and syntax errors, and provide alternative better phrasing. Keep the response language in ${langName}. Write your feedback in rich, beautiful Markdown.
Return your evaluation in the required JSON format.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'The numeric score out of 20 points.',
            },
            feedback: {
              type: Type.STRING,
              description: 'Detailed evaluation, marked errors, and corrections in Markdown format.',
            },
          },
          required: ['score', 'feedback'],
        },
      },
    });

    const resultText = response.text?.trim() || '{}';
    const parsedResult = JSON.parse(resultText);
    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error grading with Gemini:', error);
    res.status(500).json({
      error: 'Failed to grade your response using AI.',
      details: error.message || error,
    });
  }
});

// 3. AI Dynamic Exam Generation Endpoint
app.post('/api/gemini/generate-exam', async (req, res) => {
  try {
    const { difficulty, explanatoryLanguage } = req.body;
    const ai = getGeminiClient();

    const diffLabel = difficulty || 'medium';
    let langName = 'Persian (Farsi)';
    if (explanatoryLanguage === 'en') langName = 'English';
    if (explanatoryLanguage === 'it') langName = 'Italian';

    const systemInstruction = `You are a professional designer of CILS B1 (Modulo Cittadinanza) exams.
Your task is to generate an entire, highly realistic Italian language practice exam in JSON format.
The difficulty level is: "${diffLabel}".
All generated content, instructions, and questions must be tailored to this level:
- Easy: simple vocabulary, clear dialogues, slow-paced feeling text, extra hints.
- Medium: standard B1 Cittadinanza level (like the official Toscana mobility, sports in piazza themes).
- Hard: more complex structures, advanced B1+ vocabulary, subtle distractors.

To optimize token count and generation speed, the exam MUST follow this size:
1. Listening (Ascolto):
   - Prova 1: A transcript of 4 short dialogue pieces (1 to 4) + 4 Multiple Choice questions (A, B, C).
   - Prova 2: A transcript of 2 thematic paragraphs + 6 True/False statements.
2. Reading (Lettura):
   - Prova 1: A short news or utility article about Italian public service/culture/geography (approx 150-200 words) + 6 True/False statements.
   - Prova 2: A text with 4 gaps + 4 Cloze multiple-choice questions (A, B, C) corresponding to gaps 1, 2, 3, 4 (Gap 0 is the provided example).
3. Writing (Scrittura):
   - A realistic writing prompt about living in Italy, citizenship, Italian culture, or community.
4. Speaking (Parlato):
   - Prova 1: A municipal or daily life interaction/roleplay prompt with AI.
   - Prova 2: A personal monologue topic.

Ensure all questions have an "explanation" written in ${langName}.
Return exactly the schema specified. All fields must be populated. Do not use placeholders.`;

    const examSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        listening: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.STRING },
            timeLimitMinutes: { type: Type.INTEGER },
            prova1: {
              type: Type.OBJECT,
              properties: {
                instructions: { type: Type.STRING },
                audioTranscript: { type: Type.STRING, description: 'Complete Italian dialogues for the 4 pieces' },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 3 options starting with A), B), C)' },
                      correctAnswer: { type: Type.STRING, description: 'Must be "A", "B", or "C"' },
                      explanation: { type: Type.STRING },
                    },
                    required: ['id', 'text', 'options', 'correctAnswer', 'explanation'],
                  },
                },
              },
              required: ['instructions', 'audioTranscript', 'questions'],
            },
            prova2: {
              type: Type.OBJECT,
              properties: {
                instructions: { type: Type.STRING },
                audioTranscript: { type: Type.STRING, description: 'Complete Italian text for Prova 2 (usually split into 2 topics)' },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      correctAnswer: { type: Type.BOOLEAN, description: 'true for VERO, false for FALSO' },
                      explanation: { type: Type.STRING },
                    },
                    required: ['id', 'text', 'correctAnswer', 'explanation'],
                  },
                },
              },
              required: ['instructions', 'audioTranscript', 'questions'],
            },
          },
          required: ['title', 'instructions', 'timeLimitMinutes', 'prova1', 'prova2'],
        },
        reading: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.STRING },
            timeLimitMinutes: { type: Type.INTEGER },
            prova1: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                text: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      correctAnswer: { type: Type.BOOLEAN },
                      explanation: { type: Type.STRING },
                    },
                    required: ['id', 'text', 'correctAnswer', 'explanation'],
                  },
                },
              },
              required: ['title', 'text', 'questions'],
            },
            prova2: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                textWithGaps: { type: Type.STRING, description: 'Text with placeholders like (0) __A__, (1) ______, (2) ______, etc.' },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 3 options starting with A), B), C)' },
                      correctAnswer: { type: Type.STRING, description: 'Must be "A", "B", or "C"' },
                      explanation: { type: Type.STRING },
                    },
                    required: ['id', 'text', 'options', 'correctAnswer', 'explanation'],
                  },
                },
              },
              required: ['title', 'textWithGaps', 'questions'],
            },
          },
          required: ['title', 'instructions', 'timeLimitMinutes', 'prova1', 'prova2'],
        },
        writing: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.STRING },
            timeLimitMinutes: { type: Type.INTEGER },
            prompt: { type: Type.STRING },
            minWords: { type: Type.INTEGER },
            maxWords: { type: Type.INTEGER },
          },
          required: ['title', 'instructions', 'timeLimitMinutes', 'prompt', 'minWords', 'maxWords'],
        },
        speaking: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.STRING },
            timeLimitMinutes: { type: Type.INTEGER },
            prova1RoleplayPrompt: { type: Type.STRING },
            prova2MonologuePrompt: { type: Type.STRING },
          },
          required: ['title', 'instructions', 'timeLimitMinutes', 'prova1RoleplayPrompt', 'prova2MonologuePrompt'],
        },
      },
      required: ['title', 'listening', 'reading', 'writing', 'speaking'],
    };

    const userPrompt = `Please generate a custom Italian CILS B1 Citizenship preparation exam with difficulty: ${diffLabel}.
Explanation language for feedback and question explanation fields MUST be in ${langName}.
Ensure all JSON fields are complete and syntactically correct.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: examSchema,
      },
    });

    const examJsonText = response.text?.trim() || '{}';
    const parsedExam = JSON.parse(examJsonText);

    // Inject unique ID and fields to match custom exam schema
    parsedExam.id = 'ai_exam_' + Date.now();
    parsedExam.isAiGenerated = true;
    parsedExam.difficulty = diffLabel;

    res.json(parsedExam);
  } catch (error: any) {
    console.error('Error generating exam with Gemini:', error);
    res.status(500).json({
      error: 'Failed to generate a new exam using AI.',
      details: error.message || error,
    });
  }
});

// 4. Vite integration for Full-Stack development / Production asset serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CILS B1 prep server listening on http://localhost:${PORT}`);
  });
}

startServer();
