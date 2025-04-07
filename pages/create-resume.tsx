import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import OutgoingAudio from "@/components/interview/OutgoingAudio";
import SpeechVisualizer from "@/components/SpeechVisualizer";
import { AzureStreamingTTS } from '@/services/azureStreamingTTS';
import Image from "next/image";

export default function CreateResume() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
    const [ttsService, setTtsService] = useState<AzureStreamingTTS | null>(null);
    const [sessionStarted, setSessionStarted] = useState(false);

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
        // Initialize TTS service
        try {
            const service = new AzureStreamingTTS();
            setTtsService(service);
        } catch (error) {
            console.error('Failed to initialize TTS service:', error);
            setError('Unable to initialize voice assistant. Please check your Azure Speech credentials.');
        }
    }, []);

    const handleStartSession = async () => {
        if (!ttsService || hasGreeted) return;

        try {
            setError(null);
            setIsGreetingPlaying(true);
            setSessionStarted(true);

            const greetingText = `Hello ${user?.name || 'there'}, I'm your AI resume assistant. I'll help you create a professional resume. Please introduce yourself and tell me about your professional experience.`;

            console.log('Starting streaming TTS...');
            await ttsService.speak(greetingText);
            console.log('Streaming TTS completed');

            setHasGreeted(true);
            // Start recording automatically after greeting
            setIsRecording(true);
        } catch (error) {
            console.error('Error during TTS:', error);
            setError('Unable to initialize voice assistant. Please try refreshing the page.');
            setHasGreeted(true);
        } finally {
            setIsGreetingPlaying(false);
        }
    };

    const handleSendAudio = async () => {
        try {
            setIsRecording(false);

            // Simulate AI response
            if (ttsService) {
                setIsGreetingPlaying(true);
                const responseText = "Thank you for sharing that information. Let me help you create a professional resume based on your experience.";
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
                ttsService.stop();
            }
        };
    }, [ttsService]);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Head>
                <title>Create Your Resume - MeraResumeBanao</title>
                <meta name="description" content="Create your professional resume with AI assistance" />
            </Head>

            {/* Navigation */}
            <nav className="w-full px-8 py-4 bg-white dark:bg-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                    <TypingAnimation />
                </h1>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 md:mt-0">
                    {isAuthenticated && user ? (
                        <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                            <span className="text-green-500">✓</span>
                            <span className="text-base font-semibold text-green-700 dark:text-green-400">
                                Welcome, {user.name || user.email || user.phone || 'User'}
                            </span>
                        </div>
                    ) : null}
                    <div className="flex space-x-6">
                        <Link href="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Home</Link>
                        <Link href="/how-it-works" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">How it Works</Link>
                        <Link href="/pricing" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Pricing</Link>
                        <Link href="/buy-bundle" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Buy Resume Bundle</Link>
                    </div>
                </div>
            </nav>

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

                            {/* Recording Controls */}
                            <div className="mt-8 flex justify-center">
                                {!sessionStarted && (
                                    <button
                                        onClick={handleStartSession}
                                        className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                                    >
                                        Start Resume
                                    </button>
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