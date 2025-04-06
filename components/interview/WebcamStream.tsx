import {useEffect, useRef} from "react";

export default function WebcamStream() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        startCamera().then(r => console.log('Camera started', r)).catch(e => console.error('Error starting camera:', e));


        async function startCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }


        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


    return (
        <div className="flex flex-col items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-auto`}
            />
        </div>
    );
}