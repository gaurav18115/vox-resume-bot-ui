interface AzureTTSConfig {
    endpoint: string;
    key: string;
    region: string;
}

const config: AzureTTSConfig = {
    endpoint: process.env.NEXT_PUBLIC_AZURE_TTS_ENDPOINT || '',
    key: process.env.NEXT_PUBLIC_AZURE_TTS_KEY || '',
    region: process.env.NEXT_PUBLIC_AZURE_TTS_REGION || 'swedencentral'
};

export async function textToSpeech(text: string): Promise<Blob> {
    try {
        // Validate configuration
        if (!config.key) {
            throw new Error('Azure TTS key is missing. Please check your environment variables.');
        }

        // Log the configuration (without exposing sensitive data)
        console.log('Azure TTS Configuration:', {
            region: config.region,
            hasKey: !!config.key
        });

        const ssml = `
            <speak version='1.0' xml:lang='en-US'>
                <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
                    ${text}
                </voice>
            </speak>
        `;

        console.log('Making TTS request with SSML:', ssml);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': config.key,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
                'User-Agent': 'MeraResumeBanao'
            },
            body: ssml
        });

        // Log response status and headers
        console.log('TTS Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Azure TTS API error details:', errorText);
            throw new Error(`Azure TTS API error: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const audioBlob = await response.blob();
        console.log('Audio blob received:', {
            size: audioBlob.size,
            type: audioBlob.type
        });

        return audioBlob;
    } catch (error) {
        console.error('Error in textToSpeech:', error);
        throw error;
    }
} 