import React, { useState, useCallback } from 'react';
import { Upload, Leaf, Loader, ArrowRight, X } from 'lucide-react';
import axios from 'axios';

export default function TreeSpecie() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [detectedSpecies, setDetectedSpecies] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFile = (file) => {
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
        setDetectedSpecies('');
        setError('');
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const resetState = () => {
        setFile(null);
        setImagePreview('');
        setDetectedSpecies('');
        setError('');
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please upload an image');
            return;
        }

        try {
            setLoading(true);
            setAnalyzing(true);

            const base64 = await toBase64(file);
            const response = await axios.post('http://localhost:5000/api/tree-species/detect', {
                imageBase64: base64.split(',')[1],
            });

            const speciesList = response.data.predictions.map((pred) => pred.class).join(', ');
            setDetectedSpecies(speciesList);
        } catch (err) {
            console.error('Error:', err);
            setError('Error detecting tree species. Please try again.');
        } finally {
            setLoading(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                            Tree Species Detector
                        </h1>
                        <p className="mt-2 text-gray-400">Identify tree species from images</p>
                    </div>
                    <Leaf className="h-12 w-12 text-green-400" />
                </div>

                {!file ? (
                    <div
                        className={`relative rounded-xl border-2 p-12
              ${dragActive
                                ? 'border-green-400 bg-green-400/10'
                                : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/50'}
              transition-all duration-300 ease-out
              backdrop-blur-sm
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
                                <Upload className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Upload aerial imagery</h3>
                            <p className="text-gray-400">Drag and drop or click to select</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="relative">
                            <button
                                onClick={resetState}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors duration-200 backdrop-blur-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full rounded-xl object-cover max-h-[600px]"
                            />
                        </div>

                        {!analyzing ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="group flex items-center justify-center w-full py-4 px-6 
                         bg-green-500 hover:bg-green-600 rounded-xl font-medium
                         transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed"
                            >
                                Analyze Image
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="flex items-center justify-center py-4 px-6 
                            bg-green-500/20 rounded-xl font-medium text-green-400">
                                <Loader className="animate-spin mr-3 h-5 w-5" />
                                Processing your image...
                            </div>
                        )}

                        {detectedSpecies && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm">
                                    <h3 className="text-2xl font-bold text-green-400 mb-4">Detected Species</h3>
                                    <p className="text-lg text-gray-200">{detectedSpecies}</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-6 rounded-xl bg-red-900/50 backdrop-blur-sm">
                                    <h3 className="text-2xl font-bold text-red-400 mb-4">Error</h3>
                                    <p className="text-lg text-gray-200">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
