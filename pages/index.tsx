// pages/index.tsx
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";
import Head from "next/head";
import { FaCheckCircle, FaFileAlt, FaLightbulb, FaDownload } from "react-icons/fa";
import Footer from "../components/Footer";
import Testimonials from "@/components/Testimonials";
import LoginModal from "@/components/LoginModal";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Navigation from "@/components/Navigation";

interface OtplessUser {
    token: string;
    email?: string;
    name?: string;
    phone?: string;
    timestamp?: number;
}

// Add type declaration for window.otpless
declare global {
    interface Window {
        otpless: (otplessUser?: OtplessUser) => void;
    }
}

function HomeContent() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleCTAClick = () => {
        if (isAuthenticated) {
            router.push('/create-resume');
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const features = [
        {
            icon: <FaFileAlt className="w-6 h-6" />,
            title: "Tell your experience and skills",
            description: "Share your professional journey and expertise with our AI"
        },
        {
            icon: <FaLightbulb className="w-6 h-6" />,
            title: "Customize your resume layout",
            description: "Choose from multiple professional templates"
        },
        {
            icon: <FaCheckCircle className="w-6 h-6" />,
            title: "Get real-time suggestions",
            description: "AI-powered feedback to improve your resume"
        },
        {
            icon: <FaDownload className="w-6 h-6" />,
            title: "Download in multiple formats",
            description: "PDF, DOCX, and more formats available"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
            <Head>
                <title>MeraResumeBanao - Create Professional Resumes with AI</title>
                <meta name="description" content="Create professional resumes with AI assistance. Get real-time suggestions and download in multiple formats." />
                <script
                    id="otpless-sdk"
                    type="text/javascript"
                    data-appid={`${process.env.NEXT_PUBLIC_OTPLESS_APP_ID}`}
                    src="https://otpless.com/v4/auth.js"
                    async
                />
                <script dangerouslySetInnerHTML={{
                    __html: `
                        window.otpless = (otplessUser) => {
                            if (otplessUser && otplessUser.token) {
                                console.log('Token:', otplessUser.token);
                                console.log('User Details:', JSON.stringify(otplessUser));
                                // You can handle the user data here or redirect to another page
                                window.location.href = '/create-resume';
                            } else {
                                console.error('No user data received from OTPLESS');
                            }
                        }
                    `}} />
            </Head>

            {/* Navigation */}
            <Navigation />
            {/* Hero Section */}
            <main className="flex-1">
                <section className="py-12 px-8 max-w-7xl mx-auto">
                    <h1 className="my-4 text-5xl md:text-6xl font-extrabold leading-tight">
                        <TypingAnimation />
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-300 max-w-lg">
                                Build your perfect resume with AI assistance
                            </h2>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="text-blue-500 dark:text-blue-400">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{feature.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleCTAClick}
                                className="my-12 w-fit inline-flex items-center justify-center
                                bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
                                text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all
                                transform hover:scale-[1.05] hover:shadow-xl"
                            >
                                Craft Your Dream Resume Now
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-md h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl shadow-xl flex items-center justify-center">
                                <div className="text-center p-8">
                                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">Your Dream Resume</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Start creating your professional resume today!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Testimonials />
            </main>

            <Footer />
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
