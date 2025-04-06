import { useEffect, useState } from 'react';
import { FaWhatsapp, FaGoogle, FaPhone } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface OTPlessEventCallback {
    responseType: 'ONETAP' | 'FAILED' | 'FALLBACK_TRIGGERED';
    response: {
        token?: string;
        error?: string;
        message?: string;
        status?: string;
        userId?: string;
        name?: string;
        email?: string;
        phone?: string;
        [key: string]: unknown;
    };
}

interface OTPlessInstance {
    initiate: (options: {
        channel: 'PHONE' | 'EMAIL' | 'OAUTH';
        phone?: string;
        countryCode?: string;
        email?: string;
        channelType?: string;
    }) => void;
}

declare global {
    interface Window {
        OTPless: new (callback: (eventCallback: OTPlessEventCallback) => void) => OTPlessInstance;
    }
}

export default function OTPLessSignin() {
    const { setUser } = useAuth();
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [showInstructions, setShowInstructions] = useState(false);
    const [otplessInstance, setOtplessInstance] = useState<OTPlessInstance | null>(null);

    useEffect(() => {
        // Load OTPLESS SDK
        const script = document.createElement('script');
        script.id = 'otpless-sdk';
        script.src = 'https://otpless.com/v4/headless.js';
        script.setAttribute('data-appid', process.env.NEXT_PUBLIC_OTPLESS_APP_ID || '');
        script.async = true;
        document.head.appendChild(script);

        // Initialize OTPLESS when script is loaded
        script.onload = () => {
            const callback = (eventCallback: OTPlessEventCallback) => {
                const ONETAP = () => {
                    const { response } = eventCallback;
                    console.log('One-tap response:', response);
                    // Handle successful login
                    if (response.token && response.userId) {
                        // Update auth context with user data
                        setUser({
                            token: response.token,
                            userId: response.userId,
                            name: response.name,
                            email: response.email,
                            phone: response.phone
                        });
                        // Redirect after a short delay to show success state
                        setTimeout(() => {
                            window.location.href = '/create-resume';
                        }, 1000);
                    }
                };

                const FAILED = () => {
                    const { response } = eventCallback;
                    console.error('Authentication failed:', response);
                };

                const FALLBACK_TRIGGERED = () => {
                    const { response } = eventCallback;
                    console.log('Fallback triggered:', response);
                };

                const EVENTS_MAP = {
                    ONETAP,
                    FAILED,
                    FALLBACK_TRIGGERED
                };

                if ("responseType" in eventCallback) {
                    EVENTS_MAP[eventCallback.responseType]();
                }
            };

            const OTPlessSignin = new window.OTPless(callback);
            setOtplessInstance(OTPlessSignin);
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [setUser]);

    const handlePhoneAuth = () => {
        if (otplessInstance) {
            otplessInstance.initiate({
                channel: "PHONE",
                phone: phone,
                countryCode: countryCode,
            });
            setShowInstructions(true);
        }
    };

    const handleOAuth = (provider: string) => {
        if (otplessInstance) {
            otplessInstance.initiate({
                channel: "OAUTH",
                channelType: provider,
            });
        }
    };

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            {/* Phone Authentication */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-20 p-2 border rounded"
                        placeholder="+91"
                    />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 p-2 border rounded"
                        placeholder="Enter mobile number"
                    />
                </div>
                <button
                    onClick={handlePhoneAuth}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    <FaPhone />
                    <span>Continue with Phone</span>
                </button>
            </div>

            {/* Instructions Message */}
            {showInstructions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium">Please check your phone</p>
                    <p>Follow the instructions sent to your phone to complete the sign-in process.</p>
                </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-2">
                <button
                    onClick={() => handleOAuth('WHATSAPP')}
                    className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    <FaWhatsapp />
                    <span>Continue with WhatsApp</span>
                </button>
                <button
                    onClick={() => handleOAuth('GMAIL')}
                    className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                    <FaGoogle />
                    <span>Continue with Google</span>
                </button>
            </div>
        </div>
    );
} 