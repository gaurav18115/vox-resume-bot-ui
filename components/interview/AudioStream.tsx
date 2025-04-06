import {useEffect, useRef, useState} from "react";

export default function MicStreamComponent() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const [numVoices, setNumVoices] = useState(0); // Count of detected voices
    const peakHistoryRef = useRef<number[][]>([]); // Store recent peak counts for consistency

    useEffect(() => {
        let audioAnalyzer: AnalyserNode | null = null;
        let animationFrameId: number;

        async function startMicrophone() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            audioAnalyzer = audioContextRef.current.createAnalyser();
            audioAnalyzer.fftSize = 2048; // Larger FFT size for better frequency resolution
            source.connect(audioAnalyzer);
            detectVoices();
        }

        function detectVoices() {
            if (!audioAnalyzer) return;

            const bufferLength = audioAnalyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const detect = () => {
                audioAnalyzer!.getByteFrequencyData(dataArray);

                // Find peaks in the frequency data
                const peaks = findPeaks(dataArray);

                // Update peak history (keep last 10 frames)
                peakHistoryRef.current.push(peaks);
                if (peakHistoryRef.current.length > 10) {
                    peakHistoryRef.current.shift();
                }

                // Calculate consistent voice count
                const consistentVoiceCount = getConsistentVoiceCount();
                setNumVoices(consistentVoiceCount);

                animationFrameId = requestAnimationFrame(detect);
            };

            detect();
        }

        // Function to find peaks in the frequency data
        function findPeaks(data: Uint8Array) {
            const peaks: number[] = [];
            const threshold = 150; // Higher threshold to filter out low-level noise (adjustable)
            const minDistance = 20; // Minimum frequency bins between peaks (increased)

            for (let i = 1; i < data.length - 1; i++) {
                if (
                    data[i] > threshold && // Above threshold
                    data[i] > data[i - 1] && // Local maximum
                    data[i] > data[i + 1]
                ) {
                    if (!peaks.length || i - peaks[peaks.length - 1] > minDistance) {
                        peaks.push(i);
                    }
                }
            }
            return peaks;
        }


        // Ensure peaks are consistent over time to count as voices
        function getConsistentVoiceCount() {
            if (peakHistoryRef.current.length < 5) return 0; // Wait for enough data

            // Count how often each peak bin appears across frames
            const peakCounts: { [key: number]: number } = {};
            peakHistoryRef.current.forEach(framePeaks => {
                framePeaks.forEach(peak => {
                    // Group peaks within a small range (e.g., ±2 bins) as the same voice
                    const roundedPeak = Math.round(peak / 2) * 2;
                    peakCounts[roundedPeak] = (peakCounts[roundedPeak] || 0) + 1;
                });
            });

            // Consider a peak a voice if it appears in at least 50% of recent frames
            const consistentPeaks = Object.entries(peakCounts).filter(
                ([, count]) => count >= peakHistoryRef.current.length * 0.5
            );

            // Filter for human voice range and cap at 4
            const minBin = Math.floor(85 / 23.4);
            const maxBin = Math.floor(255 / 23.4);
            const voicePeaks = consistentPeaks.filter(
                ([bin]) => Number(bin) >= minBin && Number(bin) <= maxBin
            );

            return Math.min(voicePeaks.length, 4);
        }

        startMicrophone().then(r => console.log(`Microphone started ${r}`)).catch(e => console.error('Error starting microphone:', e));

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <p>
                {numVoices > 0
                    ? `${numVoices} Voice${numVoices > 1 ? "s" : ""} Detected ✅`
                    : "No Voices Detected ❌"}
            </p>
        </div>
    );
}