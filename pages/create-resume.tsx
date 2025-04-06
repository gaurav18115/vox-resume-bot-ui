import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function CreateResume() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth state and cookies
        console.log('Auth State:', {
            isAuthenticated,
            user,
            cookie: Cookies.get('user')
        });

        // Only redirect if we're sure the user is not authenticated
        if (!isAuthenticated && !Cookies.get('user')) {
            router.push('/');
            return;
        }

        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, router]);

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
                            {/* Content will be added here */}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
} 