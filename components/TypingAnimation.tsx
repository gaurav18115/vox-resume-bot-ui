'use client';

import {useEffect, useState} from 'react';

const TypingAnimation = () => {
    const textEnglish = "Mera Resume Banao...";
    const textHindi = "मेरा रिज्यूम बनाओ...";
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHindi, setIsHindi] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseDuration = 1000;

        const timer = setTimeout(() => {
            const text = isHindi ? textHindi : textEnglish;

            if (!isDeleting && index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                setIndex(index + 1);
            } else if (!isDeleting && index === text.length) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && index > 0) {
                setDisplayedText(text.slice(0, index - 1));
                setIndex(index - 1);
            } else if (isDeleting && index === 0) {
                setIsDeleting(false);
                setIsHindi(!isHindi);
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [index, isDeleting, isHindi]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className={`h-11 font-mono text-white ${
                    isHindi ? 'text-3xl md:text-3xl' : 'text-2xl md:text-2xl'
                }`}
            >
                {displayedText}
                <span className="animate-blink">|</span>
            </div>
        </div>
    );
};

export default TypingAnimation;