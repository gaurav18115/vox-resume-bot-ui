import { useEffect, useRef, useState } from "react";

interface SpeechVisualizerProps {
    audioBlob?: Blob | null; // Made optional to support stream-only use
    isPlaying: boolean;
    audioStream?: MediaStream;
}

export const SpeechVisualizer: React.FC<SpeechVisualizerProps> = ({ audioBlob, isPlaying, audioStream}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | MediaStreamAudioSourceNode | null>(null);
    const animationRef = useRef<number>(0);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    useEffect(() => {
        // Initialize audio context
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.5;
        }

        // Load audio data from Blob (existing functionality)
        if (audioBlob && audioBlob.size > 0) {
            const fileReader = new FileReader();
            fileReader.onload = async (event) => {
                if (event.target?.result && audioContextRef.current) {
                    try {
                        const arrayBuffer = event.target.result as ArrayBuffer;
                        const decodedData = await audioContextRef.current.decodeAudioData(arrayBuffer);
                        setAudioBuffer(decodedData);
                    } catch (error) {
                        console.error("Error decoding audio data", error);
                    }
                }
            };
            fileReader.readAsArrayBuffer(audioBlob);
        }

        // Handle audio stream input
        if (audioStream && !audioBlob) {
            if (audioContextRef.current && analyserRef.current) {
                sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream);
                sourceRef.current.connect(analyserRef.current);
                // Don't play the audio only analyse it
                // analyserRef.current.connect(audioContextRef.current.destination);
                if (isPlaying) drawVisualization();
            }
        }

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (sourceRef.current instanceof AudioBufferSourceNode) {
                sourceRef.current.stop();
            }
            sourceRef.current = null;
        };
    }, [audioBlob, audioStream]);

    useEffect(() => {
        if (!audioContextRef.current || !analyserRef.current || (!audioBuffer && !audioStream)) return;

        // Handle Blob playback (existing functionality)
        if (audioBuffer && audioBlob) {
            if (sourceRef.current) {
                if (sourceRef.current instanceof AudioBufferSourceNode) {
                    sourceRef.current.stop();
                }
                sourceRef.current = null;
            }

            if (isPlaying) {
                sourceRef.current = audioContextRef.current.createBufferSource();
                sourceRef.current.buffer = audioBuffer;
                sourceRef.current.connect(analyserRef.current);
                // Don't play the audio, only analyse it.
                // analyserRef.current.connect(audioContextRef.current.destination);
                sourceRef.current.start();
                drawVisualization();
            }
        } else if (audioStream && sourceRef.current && isPlaying) {
            // If using microphone and source is already set, just start visualization
            drawVisualization();
        }
    }, [isPlaying, audioBuffer, audioBlob]);

    const drawVisualization = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const width = canvas.width;
        const height = canvas.height;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current!.getByteFrequencyData(dataArray);

            canvasCtx.clearRect(0, 0, width, height);

            canvasCtx.beginPath();
            canvasCtx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
            canvasCtx.setLineDash([2, 5]);
            canvasCtx.moveTo(0, height / 2);
            canvasCtx.lineTo(width, height / 2);
            canvasCtx.stroke();
            canvasCtx.setLineDash([]);

            canvasCtx.fillStyle = '#8B0000';
            const barWidth = 1;
            const spacing = 2;
            const totalBarSpace = barWidth + spacing;
            const numBars = Math.floor(width / totalBarSpace);
            const startX = (width - (numBars * totalBarSpace)) / 2;
            const centerBarIndex = Math.floor(numBars / 2);

            for (let i = 0; i < numBars; i++) {
                const distanceFromCenter = Math.abs(i - centerBarIndex) + 2;
                const binIndex = Math.floor(((distanceFromCenter / centerBarIndex) * bufferLength) / 2);
                if (binIndex >= bufferLength || binIndex < 2) continue;

                let barHeight = dataArray[binIndex];
                if ((binIndex > 5 && binIndex < 15) || (binIndex > 30 && binIndex < 50)) {
                    barHeight = barHeight * 1.2;
                }

                const maxHeight = (dataArray[binIndex] / 255) * height * 0.7;
                const taperFactor = 1 - (distanceFromCenter / centerBarIndex);
                barHeight = maxHeight * taperFactor;

                const x = startX + (i * totalBarSpace);
                canvasCtx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
            }
        };

        draw();
    };

    return (
        <div className="w-full flex justify-center">
            <canvas ref={canvasRef} width={360} height={80} className="rounded-md" />
        </div>
    );
};