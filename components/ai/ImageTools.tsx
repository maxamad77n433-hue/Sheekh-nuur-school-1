
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SparklesIcon } from '../Icons';

const ImageTools: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [editPrompt, setEditPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setEditedImage(null);
                setOriginalMimeType(file.type);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const fileToGenerativePart = (base64Data: string, mimeType: string) => {
        return {
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType
          }
        };
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editPrompt || !originalImage) return;
        setEditing(true);
        setError(null);
        setEditedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = fileToGenerativePart(originalImage, originalMimeType);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [imagePart, { text: editPrompt }],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            const part = response.candidates?.[0]?.content?.parts?.[0];
            if (part && part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                setEditedImage(imageUrl);
            } else {
                setError('Could not process the image edit.');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to edit image. Please try again.');
        } finally {
            setEditing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Generation */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />Generate an Image</h3>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic classroom in Sheikh Nuur School with robots..."
                    className="w-full p-2 border rounded-lg mb-4 h-24"
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-2 border rounded-lg">
                        <option value="1:1">Square (1:1)</option>
                        <option value="16:9">Landscape (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                        <option value="4:3">Standard (4:3)</option>
                        <option value="3:4">Tall (3:4)</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                    {loading ? 'Generating...' : 'Generate'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {generatedImage && <img src={generatedImage} alt="Generated" className="mt-4 rounded-lg w-full" />}
            </div>

            {/* Image Editing */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />Edit an Image</h3>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full p-2 border border-dashed rounded-lg mb-4 text-gray-600 hover:border-primary">
                    {originalImage ? 'Change Image' : 'Upload an Image'}
                </button>
                {originalImage && <img src={originalImage} alt="Original for editing" className="mb-4 rounded-lg w-full max-h-48 object-contain" />}
                {originalImage && (
                    <>
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g., Add a retro filter, or remove the person in the background"
                            className="w-full p-2 border rounded-lg mb-4 h-24"
                        />
                        <button onClick={handleEdit} disabled={editing} className="w-full bg-accent text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
                            {editing ? 'Editing...' : 'Apply Edit'}
                        </button>
                    </>
                )}
                 {editedImage && <img src={editedImage} alt="Edited" className="mt-4 rounded-lg w-full" />}
            </div>
        </div>
    );
};

export default ImageTools;
