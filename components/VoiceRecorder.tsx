import { useState, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                onRecordingComplete(audioBlob);
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Record Your Experience</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                Click the microphone button to start recording your professional experience and skills.
            </p>
            <div className="flex items-center space-x-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-4 rounded-full ${isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors duration-200`}
                >
                    {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                    {isRecording ? 'Recording...' : 'Click to start recording'}
                </span>
            </div>
            {error && (
                <p className="mt-4 text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
} 