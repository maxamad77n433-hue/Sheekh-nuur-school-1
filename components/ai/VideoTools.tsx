
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { SparklesIcon } from '../Icons';

const VideoTools: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [image, setImage] = useState<{ base64: string, mimeType: string } | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const checkApiKey = async () => {
        // @ts-ignore
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setHasApiKey(true);
        } else {
            setHasApiKey(false);
        }
    };

    useEffect(() => {
        checkApiKey();
    }, []);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({ base64: (reader.result as string).split(',')[1], mimeType: file.type });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const selectApiKey = async () => {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasApiKey(true); // Assume success to avoid race conditions
    };

    const handleGenerate = async () => {
        if (!prompt && !image) {
            setError('Please provide a prompt or an image.');
            return;
        }
        await checkApiKey();
        if (!hasApiKey) {
            setError("Please select an API key to generate videos.");
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        setLoadingMessage('Initializing video generation...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            let operation: GenerateVideosOperation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt,
                ...(image && { image: { imageBytes: image.base64, mimeType: image.mimeType } }),
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio as '16:9' | '9:16',
                }
            });

            setLoadingMessage('Your video is being created... This can take a few minutes. We appreciate your patience!');
            
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if(operation.error) {
                 throw new Error(operation.error.message);
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 const blob = await response.blob();
                 const videoUrl = URL.createObjectURL(blob);
                 setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error("Video generation completed, but no download link was found.");
            }

        } catch (e: any) {
            console.error(e);
             if (e.message && e.message.includes("Requested entity was not found")) {
                setError("Your API Key is invalid. Please select a valid key.");
                setHasApiKey(false);
            } else {
                setError(`Failed to generate video: ${e.message}`);
            }
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };
    
    if (!hasApiKey) {
        return (
             <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">API Key Required</h3>
                <p className="text-gray-600 mb-4">Video generation with Veo requires a project-linked API key. Please select one to continue.</p>
                <p className="text-sm text-gray-500 mb-4">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">billing documentation</a>.</p>
                <button onClick={selectApiKey} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark">
                    Select API Key
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />Generate a Video with Veo</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A student discovering a glowing book in a library."
                className="w-full p-2 border rounded-lg mb-4 h-24"
            />
            <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full p-2 border border-dashed rounded-lg text-gray-600 hover:border-primary">
                    {image ? 'Change Start Image' : 'Animate an Image (Optional)'}
                </button>
                {image && <p className="text-sm text-green-600 mt-1">Image selected.</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-2 border rounded-lg">
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait (9:16)</option>
                </select>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                {loading ? 'Generating...' : 'Generate Video'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {loading && <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center text-primary-dark">{loadingMessage}</div>}
            {generatedVideoUrl && (
                <div className="mt-4">
                    <h4 className="font-semibold text-lg mb-2">Your Video is Ready!</h4>
                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg" />
                </div>
            )}
        </div>
    );
};

export default VideoTools;
