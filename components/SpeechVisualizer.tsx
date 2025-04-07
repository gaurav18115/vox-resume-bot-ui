import { useEffect, useRef } from 'react';
import { AzureStreamingTTS } from '@/services/azureStreamingTTS';

interface SpeechVisualizerProps {
    isPlaying: boolean;
    ttsService: AzureStreamingTTS | null;
}

export default function SpeechVisualizer({ isPlaying, ttsService }: SpeechVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !ttsService) return;

        const analyser = ttsService.getAnalyser();
        if (!analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match display size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background
            ctx.fillStyle = 'rgb(31, 41, 55)'; // dark:bg-gray-800
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            const barWidth = Math.max(2, (canvas.width / bufferLength) * 2);
            const gap = 1;
            let x = 0;

            // Draw center line
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();

            for (let i = 0; i < bufferLength; i++) {
                const value = dataArray[i];
                const percent = value / 255;
                const barHeight = (canvas.height / 2) * percent;

                // Create gradient for upper bar
                const gradientUp = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY);
                gradientUp.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // blue-500 with transparency
                gradientUp.addColorStop(1, 'rgb(59, 130, 246)'); // blue-500

                // Create gradient for lower bar
                const gradientDown = ctx.createLinearGradient(0, centerY, 0, centerY + barHeight);
                gradientDown.addColorStop(0, 'rgb(59, 130, 246)'); // blue-500
                gradientDown.addColorStop(1, 'rgba(59, 130, 246, 0.5)'); // blue-500 with transparency

                // Draw upper bar
                ctx.fillStyle = gradientUp;
                ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);

                // Draw lower bar (mirrored)
                ctx.fillStyle = gradientDown;
                ctx.fillRect(x, centerY, barWidth, barHeight);

                x += barWidth + gap;
            }
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, ttsService]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-24 bg-gray-800 rounded-lg"
            style={{ minHeight: '96px' }}
        />
    );
} 