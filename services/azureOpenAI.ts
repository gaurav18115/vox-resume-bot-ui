interface GenerateTextParams {
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

export class AzureOpenAIService {
    async generateText(params: GenerateTextParams): Promise<string> {
        try {
            console.log('Sending request to generate text:', {
                context: params.context,
                goal: params.goal,
                language: params.language,
                voice: params.voice,
                hasUserInfo: !!params.userInfo
            });

            const response = await fetch('/api/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: data.error,
                    details: data.details
                });
                throw new Error(data.details || data.error || 'Failed to generate text');
            }

            if (!data.text) {
                throw new Error('No text generated');
            }

            return data.text;
        } catch (error) {
            console.error('Error in generateText:', error);
            throw error;
        }
    }

    private buildPrompt(context: string, goal: string, language: string, voice: string, userInfo?: { name?: string; email?: string; phone?: string }): string {
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
} 