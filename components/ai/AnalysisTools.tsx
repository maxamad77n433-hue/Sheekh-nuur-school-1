
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from '../Icons';

const AnalysisTools: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('Describe this content in detail.');
    const [analysisResult, setAnalysisResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // For audio transcription
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisResult('');
            setTranscription('');
        }
    };
    
    const fileToGenerativePart = async (file: File) => {
        const base64EncodedData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: base64EncodedData, mimeType: file.type },
        };
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a file first.');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysisResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const modelName = file.type.startsWith('video') ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
            
            const filePart = await fileToGenerativePart(file);

            const response = await ai.models.generateContent({
                model: modelName,
                contents: { parts: [ {text: prompt}, filePart] },
            });
            
            setAnalysisResult(response.text);

        } catch (e: any) {
            setError('Analysis failed: ' + e.message);
        } finally {
            setLoading(false);
        }
    };
    
     const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                transcribeAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTranscription('');
            setError('');
        } catch (err) {
            setError('Could not access microphone. Please grant permission.');
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const transcribeAudio = async (audioBlob: Blob) => {
        setLoading(true);
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const audioPart = await fileToGenerativePart(new File([audioBlob], "audio.webm", {type: "audio/webm"}));

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [ {text: "Transcribe this audio."}, audioPart] },
            });

            setTranscription(response.text);
        } catch (e: any) {
             setError('Transcription failed: ' + e.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />Analyze Image or Video</h3>
                 <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 mb-4" />
                 <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-2 border rounded-lg mb-4 h-24" />
                 <button onClick={handleAnalyze} disabled={loading || !file} className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                     {loading ? 'Analyzing...' : 'Analyze Content'}
                 </button>
                 {analysisResult && (
                     <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                         <h4 className="font-semibold mb-2">Analysis Result:</h4>
                         <p className="text-gray-700 whitespace-pre-wrap">{analysisResult}</p>
                     </div>
                 )}
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />Transcribe Audio</h3>
                <p className="text-gray-600 mb-4">Record your voice to get a real-time transcription. Great for practicing speeches!</p>
                <button onClick={isRecording ? stopRecording : startRecording} disabled={loading} className={`w-full p-2 rounded-lg text-white font-semibold ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-blue-600'} disabled:bg-gray-400`}>
                    {isRecording ? 'Stop Recording' : (loading ? 'Processing...' : 'Start Recording')}
                </button>
                 {transcription && (
                     <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                         <h4 className="font-semibold mb-2">Transcription:</h4>
                         <p className="text-gray-700">{transcription}</p>
                     </div>
                 )}
            </div>
            {error && <p className="text-red-500 mt-2 col-span-full">{error}</p>}
        </div>
    );
};

export default AnalysisTools;
