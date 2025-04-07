import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="w-full px-8 py-4 bg-white dark:bg-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                <span className="text-blue-500">Mera Resume Banao</span>
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
    );
} 