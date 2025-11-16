
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';

// Helper Functions
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}


const VoiceAssistant: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('Idle. Press Start to connect.');
    const [transcripts, setTranscripts] = useState<{ user: string, model: string }[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);

    const onMessageHandler = useCallback(async (message: LiveServerMessage) => {
      const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
      if (base64Audio && outputAudioContextRef.current) {
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
          const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current);
          const source = outputAudioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContextRef.current.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
      }

      if(message.serverContent?.inputTranscription) {
          setTranscripts(prev => {
              const last = prev[prev.length - 1];
              if(last && !last.model) {
                  const updated = [...prev];
                  updated[updated.length - 1].user = message.serverContent!.inputTranscription!.text;
                  return updated;
              }
              return [...prev, {user: message.serverContent!.inputTranscription!.text, model: ''}];
          });
      }

       if(message.serverContent?.outputTranscription) {
           setTranscripts(prev => {
               const last = prev[prev.length - 1];
               if(last) {
                  const updated = [...prev];
                  updated[updated.length - 1].model = message.serverContent!.outputTranscription!.text;
                  return updated;
               }
               return prev;
           })
       }
    }, []);

    const startSession = async () => {
        setStatus('Connecting...');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: async () => {
                        setIsConnected(true);
                        setStatus('Connected. Start speaking.');
                        await startRecording();
                    },
                    onmessage: onMessageHandler,
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus(`Error: ${e.message}`);
                        stopSession();
                    },
                    onclose: (e: CloseEvent) => {
                        setStatus('Session closed.');
                        setIsConnected(false);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are a friendly school voice assistant. Be helpful and concise.'
                },
            });

        } catch (error) {
            console.error('Failed to start session:', error);
            setStatus('Failed to connect.');
        }
    };
    
    const startRecording = async () => {
         if (isRecording) return;
        
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        scriptProcessorRef.current.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
            }
            const pcmBlob: GenAIBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
            };
            if(sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            }
        };

        source.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
        setIsRecording(true);
    };

    const stopSession = useCallback(async () => {
        setIsRecording(false);
        setIsConnected(false);
        
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
            sessionPromiseRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current) {
            await inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
         if (outputAudioContextRef.current) {
            await outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        setStatus('Idle. Press Start to connect.');
    }, []);
    
    useEffect(() => {
        return () => {
            stopSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Voice Assistant</h3>
            <p className="text-gray-600 mb-4">Have a real-time conversation with our AI assistant.</p>
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={startSession}
                    disabled={isConnected}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                    Start
                </button>
                <button
                    onClick={stopSession}
                    disabled={!isConnected}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                    Stop
                </button>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-700">{status}</span>
                </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto border">
                {transcripts.map((t, i) => (
                    <div key={i} className="mb-2">
                        <p><strong className="text-primary-dark">You:</strong> {t.user}</p>
                        <p><strong className="text-accent">Assistant:</strong> {t.model}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoiceAssistant;
