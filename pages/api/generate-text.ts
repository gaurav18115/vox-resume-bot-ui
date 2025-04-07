import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Log environment variables (without sensitive data)
console.log('Environment check:', {
    hasKey: !!process.env.AZURE_OPENAI_API_KEY,
    hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT?.split('/').slice(0, 3).join('/') + '...',
    model: process.env.AZURE_OPENAI_MODEL
});

const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: process.env.AZURE_OPENAI_ENDPOINT,
    defaultQuery: { 'api-version': process.env.AZURE_OPENAI_VERSION },
});

interface GenerateTextRequest {
    context: string;
    goal: string;
    language: string;
    voice: string;
    userInfo?: {
        name?: string;
        email?: string;
        phone?: string;
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { context, goal, language, voice, userInfo } = req.body as GenerateTextRequest;

        console.log('Received request:', {
            context,
            goal,
            language,
            voice,
            hasUserInfo: !!userInfo
        });

        const prompt = buildPrompt(context, goal, language, voice, userInfo);

        console.log('Generated prompt:', prompt);

        const response = await openai.chat.completions.create({
            model: process.env.AZURE_OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        console.log('OpenAI response:', {
            hasContent: !!response.choices[0].message.content,
            contentLength: response.choices[0].message.content?.length
        });

        return res.status(200).json({ text: response.choices[0].message.content?.trim() || '' });
    } catch (error) {
        console.error('Error generating text:', error);
        return res.status(500).json({
            error: 'Failed to generate text',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

function buildPrompt(context: string, goal: string, language: string, voice: string, userInfo?: { name?: string; email?: string; phone?: string }): string {
    const userContext = userInfo?.name ? `User's name is ${userInfo.name}.` : '';

    return `You are an AI assistant helping users create their resumes. 
Context: ${context}
Goal: ${goal}
Language: ${language}
Voice: ${voice}
${userContext}

Generate a natural, conversational response in ${language} that:
1. Is appropriate for the given context and goal
2. Matches the tone and style of the selected voice
3. Is concise and clear
4. Maintains a professional yet friendly tone
5. Is culturally appropriate for the language

Response:`;
} 