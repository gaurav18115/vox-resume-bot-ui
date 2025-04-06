// pages/index.tsx
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";
import Head from "next/head";
import { FaCheckCircle, FaFileAlt, FaLightbulb, FaDownload } from "react-icons/fa";

export default function Home() {
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

    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "Software Engineer",
            content: "MeraResumeBanao helped me create a professional resume that landed me multiple interviews!"
        },
        {
            name: "Priya Patel",
            role: "Marketing Manager",
            content: "The AI suggestions were incredibly helpful in highlighting my achievements effectively."
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
                        function otpless(otplessUser) {
                            const token = otplessUser.token;
                            console.log('Token:', token);
                            console.log('User Details:', JSON.stringify(otplessUser));
                        }
                    `}} />
            </Head>

            {/* Navigation */}
            <nav className="w-full px-8 py-4 bg-white dark:bg-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">MeraResumeBanao</div>
                <div className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 md:mt-0">
                    <Link href="/create-resume" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Create Resume</Link>
                    <Link href="/how-it-works" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">How it Works</Link>
                    <Link href="/pricing" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Pricing</Link>
                    <Link href="/buy-bundle" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Buy Resume Bundle</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="py-20 px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                                <TypingAnimation />
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-300 max-w-lg">
                                Build your perfect resume with AI assistance
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-xl">
                                Create professional resumes that stand out and land you interviews
                            </p>
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
                                onClick={() => {
                                    const modal = document.getElementById("signInModal");
                                    if (modal) {
                                        modal.style.display = "block";
                                    }
                                }}
                                className="mt-8 w-fit inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
                            >
                                Craft Your Dream Resume Now
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
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

                {/* Testimonials Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.content}</p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-semibold">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">MeraResumeBanao</h3>
                            <p className="text-gray-600 dark:text-gray-400">Create professional resumes with AI assistance</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href="/create-resume" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Create Resume</Link></li>
                                <li><Link href="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">How it Works</Link></li>
                                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">FAQ</Link></li>
                                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Contact Us</Link></li>
                                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} MeraResumeBanao. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
