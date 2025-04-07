import { useEffect, useState } from 'react'
import { Button } from "@headlessui/react"

interface OutgoingAudioProps {
  startRecording: boolean
  onSendAudio: (audioBlob: Blob) => void
}

export default function OutgoingAudio({ startRecording, onSendAudio }: OutgoingAudioProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [isSending, setIsSending] = useState(false)

  const stopRecording = () => {
    console.log('OutgoingAudio stopped')
    mediaRecorder?.stop()
    setIsRecording(false)
    if (timeoutId) clearTimeout(timeoutId)
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 128
        source.connect(analyser)

        const recorder = new MediaRecorder(stream)
        recorder.ondataavailable = (event: BlobEvent) => {
          const audioBlob = event.data
          onSendAudio(audioBlob)
          setIsSending(true)
          setTimeout(() => setIsSending(false), 3000)
        }

        recorder.start()
        setMediaRecorder(recorder)
        setIsRecording(true)

        intervalId = setInterval(() => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          analyser.getByteFrequencyData(dataArray)
        }, 100)

        const autoStopTimeout = setTimeout(() => {
          console.log('Auto-stopping recording after 3 minutes')
          stopRecording()
        }, 180000)

        setTimeoutId(autoStopTimeout)
      } catch (err) {
        console.error('Error accessing microphone:', err)
      }
    }

    if (startRecording) {
      startRecording()
    }

    return () => {
      clearInterval(intervalId)
      stopRecording()
    }
  }, [startRecording, onSendAudio])

  return (
      <div className='flex flex-col text-center gap-4'>
        {isRecording && (
            <div>
              <Button onClick={stopRecording}>Send Recording</Button>
            </div>
        )}
        {isSending && (
            <div className='absolute -bottom-12 translate-x-1/4'>
              <Button>Sending audio...</Button>
            </div>
        )}
      </div>
  )
}