
import React, { useState, useEffect } from 'react';
import { SchoolIcon } from './Icons';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const SchoolProfile: React.FC = () => {
    const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location", error);
                // Default location if user denies permission (near Mogadishu)
                setUserLocation({ latitude: 2.0469, longitude: 45.3182 });
            }
        );
    }, []);

    const findNearby = async () => {
        if (!userLocation) {
            setError("Location not available. Please enable location services.");
            return;
        }
        setLoading(true);
        setError(null);
        setNearbyPlaces([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "What are some good libraries or parks nearby?",
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            }
                        }
                    }
                },
            });
            
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                setNearbyPlaces(chunks.filter((c: any) => c.maps));
            } else {
                 setError("Could not find nearby places information.");
            }

        } catch (e) {
            console.error(e);
            setError("An error occurred while fetching nearby places.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="flex items-center mb-6">
                <SchoolIcon className="w-8 h-8 text-primary"/>
                <h1 className="text-2xl font-bold text-gray-800 ml-3">Sheikh Nuur School Profile</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary-dark">Sheikh Nuur School</h2>
                    <p className="text-gray-500 mt-1">Excellence in Education</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-primary pb-2 mb-4">Vision</h3>
                        <p className="text-gray-600">To be a leading center of learning, nurturing future generations of leaders, thinkers, and innovators rooted in strong values.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-primary pb-2 mb-4">Mission</h3>
                        <p className="text-gray-600">To provide high-quality, holistic education in a safe and supportive environment, empowering students to achieve their full potential and contribute positively to society.</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <p className="text-gray-600"><strong>Location:</strong> Main Street, Mogadishu, Somalia</p>
                    <p className="text-gray-600"><strong>Phone:</strong> +252 61 123 4567</p>
                    <p className="text-gray-600"><strong>Email:</strong> info@sheikhnourschool.edu.so</p>
                </div>
                 <div className="mt-8 pt-8 border-t">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Explore Nearby</h3>
                    <p className="text-gray-600 mb-4">Use our AI assistant to find useful places near the school, like libraries or parks for studying.</p>
                    <button onClick={findNearby} disabled={loading || !userLocation} className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {loading ? 'Searching...' : 'Find Nearby Libraries & Parks'}
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {nearbyPlaces.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold">Results:</h4>
                            <ul className="list-disc list-inside mt-2 text-gray-700">
                                {nearbyPlaces.map((place, index) => (
                                    <li key={index}>
                                        <a href={place.maps.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {place.maps.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SchoolProfile;
