import { useEffect, useState } from "react";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import OutgoingAudio from "@/components/interview/OutgoingAudio";
import SpeechVisualizer from "@/components/SpeechVisualizer";
import { AzureStreamingTTS } from '@/services/azureStreamingTTS';
import { AzureOpenAIService } from '@/services/azureOpenAI';
import Image from "next/image";
import Navigation from "@/components/Navigation";

type Language = {
    code: string;
    name: string;
    voiceName: string;
};

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', voiceName: 'en-US-AvaMultilingualNeural' },
    { code: 'hi', name: 'हिंदी', voiceName: 'hi-IN-SwaraNeural' }
];

export default function CreateResume() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
    const [ttsService, setTtsService] = useState<AzureStreamingTTS | null>(null);
    const [openAIService, setOpenAIService] = useState<AzureOpenAIService | null>(null);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);

    useEffect(() => {
        console.log('Auth State:', {
            isAuthenticated,
            user,
            cookie: Cookies.get('user')
        });

        if (!isAuthenticated && !Cookies.get('user')) {
            router.push('/');
            return;
        }

        setIsLoading(false);
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        // Initialize services
        try {
            const tts = new AzureStreamingTTS(selectedLanguage.voiceName);
            const openAI = new AzureOpenAIService();
            setTtsService(tts);
            setOpenAIService(openAI);
        } catch (error) {
            console.error('Failed to initialize services:', error);
            setError('Unable to initialize services. Please check your credentials.');
        }
    }, [selectedLanguage]);

    const handleStartSession = async () => {
        if (!ttsService || !openAIService || hasGreeted) return;

        try {
            setError(null);
            setIsGreetingPlaying(true);
            setSessionStarted(true);

            // Generate greeting text using OpenAI
            const greetingText = await openAIService.generateText({
                context: "Initial greeting to start the resume creation process",
                goal: "Greet the user and explain that you'll help them create a professional resume",
                language: selectedLanguage.code,
                voice: selectedLanguage.voiceName,
                userInfo: {
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone
                }
            });

            console.log('Starting streaming TTS...');
            await ttsService.speak(greetingText);
            console.log('Streaming TTS completed');

            setHasGreeted(true);
            // Start recording automatically after greeting
            setIsRecording(true);
        } catch (error) {
            console.error('Error during session start:', error);
            setError('Unable to start the session. Please try refreshing the page.');
            setHasGreeted(true);
        } finally {
            setIsGreetingPlaying(false);
        }
    };

    const handleSendAudio = async () => {
        try {
            setIsRecording(false);

            if (ttsService && openAIService) {
                setIsGreetingPlaying(true);

                // Generate response text using OpenAI
                const responseText = await openAIService.generateText({
                    context: "User has shared their information and experience",
                    goal: "Acknowledge the information and explain next steps for resume creation",
                    language: selectedLanguage.code,
                    voice: selectedLanguage.voiceName,
                    userInfo: {
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone
                    }
                });

                await ttsService.speak(responseText);
                setIsGreetingPlaying(false);
            }
        } catch (error) {
            console.error('Error processing audio:', error);
        }
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (ttsService) {
                try {
                    ttsService.stop();
                } catch (error) {
                    console.warn('Error during TTS service cleanup:', error);
                }
            }
        };
    }, [ttsService]);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Head>
                <title>Create Your Resume - MeraResumeBanao</title>
                <meta name="description" content="Create your professional resume with AI assistance" />
            </Head>

            <Navigation />

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                                Your AI Resume Assistant is Loading...
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                                Please wait while we prepare your personalized resume creation experience.
                            </p>
                        </div>
                    ) : (
                        <div className="min-h-[60vh]">
                            {error && (
                                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-red-700 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            {/* AI Assistant Row */}
                            <div className="mb-12">
                                <div className="flex items-center space-x-8">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div className={`w-24 h-24 rounded-full border-4 ${isGreetingPlaying ? 'border-blue-500 animate-pulse' : 'border-blue-700'
                                                } flex items-center justify-center`}>
                                                <Image
                                                    src={'/icons/mic_minimal_blue.png'}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full"
                                                    alt={'AI Assistant'}
                                                />
                                            </div>
                                            {isGreetingPlaying && (
                                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                                        Speaking
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <SpeechVisualizer
                                            isPlaying={isGreetingPlaying}
                                            ttsService={ttsService}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Language Selection and Start Button */}
                            <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center space-y-4">
                                {!sessionStarted && (
                                    <>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                                            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Select Assistant Language
                                            </label>
                                            <select
                                                id="language-select"
                                                value={selectedLanguage.code}
                                                onChange={(e) => {
                                                    const lang = LANGUAGES.find(l => l.code === e.target.value);
                                                    if (lang) setSelectedLanguage(lang);
                                                }}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                {LANGUAGES.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleStartSession}
                                            className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
                                        >
                                            Start Resume
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Hidden Audio Elements */}
                            <div className="hidden">
                                <OutgoingAudio
                                    startRecording={isRecording}
                                    onSendAudio={handleSendAudio}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}