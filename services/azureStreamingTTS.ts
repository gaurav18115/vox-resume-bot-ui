import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export class AzureStreamingTTS {
    private speechConfig: sdk.SpeechConfig;
    private synthesizer: sdk.SpeechSynthesizer | null = null;
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private audioQueue: ArrayBuffer[] = [];
    private isPlaying: boolean = false;
    private currentSource: AudioBufferSourceNode | null = null;

    constructor(voiceName: string = "en-US-AvaMultilingualNeural") {
        if (!process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || !process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION) {
            throw new Error('Azure Speech credentials not found in environment variables');
        }

        this.speechConfig = sdk.SpeechConfig.fromSubscription(
            process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
            process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
        );

        // Set the voice
        this.speechConfig.speechSynthesisVoiceName = voiceName;

        // Increase the chunk size for better audio quality
        this.speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "1000");
        this.speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "1000");
        this.speechConfig.setProperty("SpeechServiceConnection_ChunkSize", "8192");
    }

    public getAudioContext(): AudioContext | null {
        return this.audioContext;
    }

    public getAnalyser(): AnalyserNode | null {
        return this.analyser;
    }

    private async initializeAudioContext(): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            console.log('AudioContext created:', this.audioContext.state);

            // Try to resume the audio context
            if (this.audioContext.state === 'suspended') {
                console.log('Attempting to resume AudioContext');
                try {
                    await this.audioContext.resume();
                    console.log('AudioContext resumed successfully');
                } catch (error) {
                    console.error('Failed to resume AudioContext:', error);
                    throw new Error('AudioContext could not be resumed. User interaction may be required.');
                }
            }
        }
    }

    public async speak(text: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Starting speech synthesis for text:', text);
                console.log('Using Azure Speech credentials:', {
                    key: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY?.substring(0, 5) + '...',
                    region: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
                });

                // Initialize audio context
                await this.initializeAudioContext();

                // Create synthesizer without audio config
                this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig);

                // Set up the synthesis event handlers
                this.synthesizer.synthesisStarted = () => {
                    console.log('Synthesis started');
                };

                this.synthesizer.synthesizing = (_sender, e) => {
                    if (e.result.audioData) {
                        // Check if the chunk is already in the queue
                        const isNewChunk = !this.audioQueue.some(chunk =>
                            chunk.byteLength === e.result.audioData.byteLength &&
                            new Uint8Array(chunk).every((byte, index) => byte === new Uint8Array(e.result.audioData)[index])
                        );

                        if (isNewChunk) {
                            this.audioQueue.push(e.result.audioData);
                            // Process the audio queue immediately when we get new data
                            this.processAudioQueue();
                        } else {
                            console.warn('Duplicate audio chunk detected and ignored');
                        }
                    }
                };

                this.synthesizer.synthesisCompleted = () => {
                    console.log('Synthesis completed');
                    // Process any remaining audio in the queue
                    this.processAudioQueue();
                };

                // Start synthesis
                this.synthesizer.speakTextAsync(
                    text,
                    (result: sdk.SpeechSynthesisResult) => {
                        console.log('SpeakTextAsync callback received with result:', {
                            reason: result.reason,
                            errorDetails: result.errorDetails,
                            audioData: result.audioData ? `Buffer of size ${result.audioData.byteLength}` : 'No audio data',
                            properties: result.properties
                        });

                        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log('Speech synthesis completed successfully');
                            if (result.audioData) {
                                console.log('Final audio data received:', {
                                    size: result.audioData.byteLength,
                                    firstBytes: Array.from(new Uint8Array(result.audioData.slice(0, 10)))
                                });
                            }
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
        if (this.isPlaying || this.audioQueue.length === 0 || !this.audioContext || !this.analyser) {
            return;
        }

        this.isPlaying = true;
        const audioData = this.audioQueue.shift();

        if (!audioData) {
            this.isPlaying = false;
            return;
        }

        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            if (this.currentSource) {
                this.currentSource.stop();
                this.currentSource = null;
            }

            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;

            // Connect to analyzer and destination
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            source.onended = () => {
                this.isPlaying = false;
                this.currentSource = null;
            };

            this.currentSource = source;
            source.start();
        } catch (error) {
            console.error('Error playing audio chunk:', error);
            this.isPlaying = false;
            this.currentSource = null;
            this.processAudioQueue();
        }
    }

    public stop(): void {
        console.log('Stopping TTS service');
        if (this.currentSource) {
            console.log('Stopping current audio source');
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