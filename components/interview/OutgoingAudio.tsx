import { useEffect, useState } from 'react'
import { Button } from "@headlessui/react";

interface OutgoingAudioProps {
  startRecording: boolean;
  onSendAudio: (audioBlob: Blob) => void;
}

export default function OutgoingAudio({ startRecording, onSendAudio }: OutgoingAudioProps) {

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [isSending, setIsSending] = useState<boolean>(false)



  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 128

    source.connect(analyser)

    const newMediaRecorder = new MediaRecorder(stream)
    newMediaRecorder.ondataavailable = (event: BlobEvent) => {
      const audioBlob = event.data
      onSendAudio(audioBlob);
      setIsSending(true);
      setTimeout(() => setIsSending(false), 3000);
    }

    newMediaRecorder.start()
    setMediaRecorder(newMediaRecorder)

    const intervalId = setInterval(() => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
    }, 100);

    // Set timeout to stop recording and auto-send after 3 minutes (180000 ms)
    const timeout = setTimeout(() => {
      console.log('Auto-stopping recording after 3 minutes');
      stopRecording()
    }, 180000)

    setTimeoutId(timeout)
    return () => clearInterval(intervalId)
  }

  const stopRecording = () => {
    console.log('OutgoingAudio stopped');

    mediaRecorder?.stop()
    setIsRecording(false);

    // Stop the auto-send timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  useEffect(() => {
    console.log('OutgoingAudio component mounted with startRecording', startRecording);
    setIsRecording(startRecording);

    if (startRecording) {
      handleStartRecording().then(() => console.log('Recording started'));
    }

    return () => {
      console.warn('OutgoingAudio component unmounted');
      stopRecording()
    }
  }, [handleStartRecording, startRecording, stopRecording])

  return (
    <div className={'flex flex-col text-center gap-4'}>
      {/*{isRecording ? (*/}
      {/*  <SpeakingAudioVisualizer initials={'You'} frequency={audioFrequency} />*/}
      {/*) : (*/}
      {/*  <SilentAudioVisualizer initials={'You'} />*/}
      {/*)}*/}
      {/*<CircleAudioVisualizer initials={'You'} frequency={audioFrequency} isSpeaking={isRecording}/>*/}
      {isRecording &&
        <div>
          <Button onClick={() => stopRecording()}>
            Send Recording
          </Button>
        </div>
      }
      {isSending &&
        <div className={'absolute -bottom-12 translate-x-1/4'}>
          <Button >
            Sending audio...
          </Button>
        </div>
      }
    </div>
  )
}