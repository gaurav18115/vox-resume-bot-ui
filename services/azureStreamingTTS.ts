import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export class AzureStreamingTTS {
    private speechConfig: sdk.SpeechConfig;
    private synthesizer: sdk.SpeechSynthesizer | null = null;
    private audioContext: AudioContext;
    private isPlaying: boolean = false;
    private audioQueue: ArrayBuffer[] = [];
    private currentSource: AudioBufferSourceNode | null = null;

    constructor() {
        if (!process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || !process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION) {
            throw new Error('Azure Speech credentials not found in environment variables');
        }

        this.speechConfig = sdk.SpeechConfig.fromSubscription(
            process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
            process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
        );

        // Set the voice
        this.speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";

        // Create audio context
        this.audioContext = new AudioContext();
        console.log('AudioContext created:', this.audioContext.state);
    }

    public async speak(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                console.log('Starting speech synthesis for text:', text);

                // Create synthesizer with default audio output
                this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig);

                // Set up the synthesis event handlers
                this.synthesizer.synthesisStarted = () => {
                    console.log('Synthesis started');
                };

                this.synthesizer.synthesizing = (_sender, e) => {
                    if (e.result.audioData) {
                        console.log('Received audio chunk of size:', e.result.audioData.byteLength);
                        this.audioQueue.push(e.result.audioData);
                        this.processAudioQueue();
                    }
                };

                // Start synthesis
                this.synthesizer.speakTextAsync(
                    text,
                    (result: sdk.SpeechSynthesisResult) => {
                        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log('Speech synthesis completed');
                            resolve();
                        } else {
                            console.error('Speech synthesis failed:', result.errorDetails);
                            reject(new Error(result.errorDetails));
                        }
                        this.synthesizer?.close();
                    },
                    (error: string) => {
                        console.error('Error during speech synthesis:', error);
                        reject(new Error(error));
                        this.synthesizer?.close();
                    }
                );
            } catch (error) {
                console.error('Error initializing speech synthesis:', error);
                reject(error);
            }
        });
    }

    private async processAudioQueue(): Promise<void> {
        if (this.isPlaying || this.audioQueue.length === 0) {
            return;
        }

        this.isPlaying = true;
        const audioData = this.audioQueue.shift();

        if (!audioData) {
            this.isPlaying = false;
            return;
        }

        try {
            console.log('Processing audio chunk of size:', audioData.byteLength);

            // Resume audio context if it's suspended (browser requirement)
            if (this.audioContext.state === 'suspended') {
                console.log('Resuming audio context');
                await this.audioContext.resume();
            }

            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            console.log('Audio buffer decoded successfully');

            // Stop any currently playing audio
            if (this.currentSource) {
                this.currentSource.stop();
                this.currentSource = null;
            }

            const source = this.audioContext.createBufferSource();
            this.currentSource = source;
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);

            source.onended = () => {
                console.log('Audio chunk playback ended');
                this.isPlaying = false;
                this.processAudioQueue();
            };

            source.start();
            console.log('Started playing audio chunk');
        } catch (error) {
            console.error('Error processing audio chunk:', error);
            this.isPlaying = false;
            this.processAudioQueue();
        }
    }

    public stop(): void {
        console.log('Stopping TTS service');
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        if (this.synthesizer) {
            this.synthesizer.close();
            this.synthesizer = null;
        }
        this.audioQueue = [];
        this.isPlaying = false;
    }
} 