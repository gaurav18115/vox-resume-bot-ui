import {useEffect, useRef} from 'react'

interface IncomingVideoProps {
    videoBlob: Blob | null;
    onVideoEnded: () => void;
    listening: boolean;
}

export default function IncomingVideo({videoBlob, onVideoEnded, listening}: IncomingVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const currentVideoUrl = useRef<string | null>(null)

    useEffect(() => {
        if (!videoBlob) return;

        console.log('[IncomingVideo.tsx] Video Blob received:', videoBlob)
        const videoUrl = URL.createObjectURL(videoBlob)
        currentVideoUrl.current = videoUrl

        if (videoRef.current) {
            videoRef.current.src = videoUrl
            videoRef.current.play()
                .then(() => {
                    console.log('Video is playing');
                })
                .catch(error => {
                    console.error('Error playing video:', error)
                })
        }

        return () => {
            if (currentVideoUrl.current) {
                URL.revokeObjectURL(currentVideoUrl.current)
            }
            if (videoRef.current) {
                videoRef.current.pause()
                // eslint-disable-next-line react-hooks/exhaustive-deps
                videoRef.current.src = ''
            }
        }
    }, [videoBlob])

    const handleVideoEnded = () => {
        // if listening, play the video again
        if (listening) {
            videoRef.current?.play()
                .then(r => console.log(`Playing video again ${r}`))
                .catch(e => console.error('Error playing video again:', e))
            return
        } else {
            onVideoEnded()
        }
    }

    return (
        <div className="flex flex-col">
            <video
                ref={videoRef}
                className="w-full rounded-lg shadow-lg"
                onEnded={handleVideoEnded}
                playsInline
                autoPlay
            >
                <source type="video/webm"/>
                Your browser does not support the video tag.
            </video>
        </div>
    )
}