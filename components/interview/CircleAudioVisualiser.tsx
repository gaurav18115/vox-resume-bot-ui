import React, { useEffect, useState } from 'react';
import {Label} from "@headlessui/react";
import clsx from 'clsx';

interface CircleAudioVisualizerProps {
    initials: string; // Initials of the user
    frequency?: number; // Frequency of the audio (optional)
    isSpeaking?: boolean; // Whether the user is speaking
}

const MIN_CIRCLE_SIZE = 100;

const CircleAudioVisualizer: React.FC<CircleAudioVisualizerProps> = ({
                                                             initials,
                                                             frequency = 150,
                                                             isSpeaking = false
                                                         }) => {
    const [circleSize, setCircleSize] = useState<number>(MIN_CIRCLE_SIZE);

    useEffect(() => {
        if (isSpeaking) {
            const newSize = Math.min(200, Math.max(MIN_CIRCLE_SIZE, frequency * 3.5));
            setCircleSize(newSize);
        } else {
            setCircleSize(MIN_CIRCLE_SIZE);
        }
    }, [frequency, isSpeaking]);

    return (
        <div className="relative flex items-center justify-center w-52 h-52">
            <div
                className={clsx(
                    "absolute rounded-full opacity-30 transition-all duration-100",
                    isSpeaking
                        ? (circleSize === MIN_CIRCLE_SIZE ? 'bg-red-800' : 'bg-red-600')
                        : 'bg-gray-400'
                )}
                style={{
                    width: `${circleSize}px`,
                    height: `${circleSize}px`,
                }}
            ></div>
            <Label className="font-mono text-4xl rounded-full object-cover">{initials}</Label>
        </div>
    );
};

export { CircleAudioVisualizer };