// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
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
    );
}