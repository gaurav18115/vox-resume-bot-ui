import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SpeechVisualizer from '@/components/SpeechVisualizer';

interface IncomingAudioProps {
    audioBlob: Blob | null;
    onAudioEnded?: () => void;
}

export default function IncomingAudio({ audioBlob, onAudioEnded }: IncomingAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioBlob) {
            setIsPlaying(false);
            return;
        }

        const newAudioSrc = URL.createObjectURL(audioBlob);
        setIsPlaying(true);

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.src = newAudioSrc;
            audioElement
                .play()
                .then(() => {
                    console.log('Audio playback started successfully');
                })
                .catch((error) => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
        }

        return () => {
            if (newAudioSrc) {
                URL.revokeObjectURL(newAudioSrc);
            }
        };
    }, [audioBlob]);

    const handleEnded = () => {
        setIsPlaying(false);
        if (onAudioEnded) onAudioEnded();
    };

    return (
        <div className="flex flex-col min-w-[200px] max-w-[600px]">
            <div className="flex flex-col items-center">
                <div className="h-48 mt-32 mb-32 relative flex items-center justify-center">
                    <div className="absolute w-56 h-56 rounded-full border-4 border-blue-700"></div>
                    <Image
                        src={'/icons/mic_minimal_blue.png'}
                        width={200}
                        height={200}
                        className={'rounded-2xl overflow-hidden'}
                        alt={'AI Interviewer Image'}
                    />
                </div>
                <div className={'text-center mt-2'}>
                    <span className="text-gray-900 dark:text-white font-light text-xl">
                        AI Interviewer
                    </span>
                </div>
            </div>
            <SpeechVisualizer audioBlob={audioBlob} isPlaying={isPlaying} />
            <div className="flex justify-center mt-2">
                <audio ref={audioRef} onEnded={handleEnded} className="hidden" />
            </div>
        </div>
    );
}