import React, { useState, useCallback } from 'react';
import { Upload, Leaf, Loader, RefreshCw } from 'lucide-react';

export default function GreenCover() {
    const [uploadedImage, setUploadedImage] = useState('');
    const [processedImage, setProcessedImage] = useState('');
    const [greenCoverPercentage, setGreenCoverPercentage] = useState('');
    const [idleLandPercentage, setIdleLandPercentage] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [animatePercentage, setAnimatePercentage] = useState(false);

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
            processImage(e.dataTransfer.files[0]);
        }
    }, []);

    const processImage = (file) => {
        setProcessing(true);
        const reader = new FileReader();

        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let blackPixelCount = 0;
                let totalGreen = 0;

                for (let i = 1; i < imageData.data.length; i += 4) {
                    totalGreen += imageData.data[i];
                }

                const meanGreen = totalGreen / (imageData.data.length / 4);

                for (let i = 0; i < imageData.data.length; i += 4) {
                    let gray = imageData.data[i + 1] * 0.587;
                    if (gray < meanGreen / 1.5) {
                        gray = 0;
                        blackPixelCount++;
                    } else {
                        gray = 255;
                    }
                    imageData.data[i] = gray;
                    imageData.data[i + 1] = gray;
                    imageData.data[i + 2] = gray;
                    imageData.data[i + 3] = 255;
                }

                ctx.putImageData(imageData, 0, 0);
                setProcessedImage(canvas.toDataURL());

                const greenCoverPercent = ((blackPixelCount / (canvas.width * canvas.height)) * 100).toFixed(2);
                setGreenCoverPercentage(greenCoverPercent);
                setIdleLandPercentage((100 - greenCoverPercent).toFixed(2));
                setProcessing(false);
                setAnimatePercentage(true);
            };

            img.src = reader.result;
            setUploadedImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processImage(e.target.files[0]);
        }
    };

    const resetAnalysis = () => {
        setUploadedImage('');
        setProcessedImage('');
        setGreenCoverPercentage('');
        setIdleLandPercentage('');
        setAnimatePercentage(false);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                            Green Cover Analysis
                        </h1>
                        <p className="mt-2 text-gray-400">
                            Upload satellite imagery to analyze vegetation coverage
                        </p>
                    </div>
                    <Leaf className="h-12 w-12 text-emerald-500" />
                </div>

                {!uploadedImage ? (
                    <div className={`relative rounded-xl border-2 p-12
            ${dragActive
                            ? 'border-emerald-400 bg-emerald-400/10'
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
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                                <Upload className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Upload aerial imagery</h3>
                            <p className="text-gray-400">Drag and drop or click to select</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="relative p-6 bg-white rounded-xl shadow-lg">
                            <button
                                onClick={resetAnalysis}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100
                         transition-colors duration-200"
                            >
                                <RefreshCw className="h-5 w-5 text-gray-600" />
                            </button>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">Original Image</h3>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={uploadedImage}
                                            alt="Original"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">Processed Image</h3>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        {processedImage ? (
                                            <img
                                                src={processedImage}
                                                alt="Processed"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {processing ? (
                                <div className="mt-6 flex items-center justify-center py-4 text-emerald-600">
                                    <Loader className="animate-spin mr-3 h-5 w-5" />
                                    Processing image...
                                </div>
                            ) : (
                                greenCoverPercentage && (
                                    <div className="mt-6 grid grid-cols-2 gap-6">
                                        <div className={`p-6 rounded-lg bg-emerald-50 transform transition-all duration-500 ${animatePercentage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 animate-fade-in'}`}>
                                            <div className="text-2xl font-bold text-emerald-700">
                                                {greenCoverPercentage}%
                                            </div>
                                            <div className="text-emerald-600">Green Cover</div>
                                        </div>

                                        <div className={`p-6 rounded-lg bg-orange-50 transform transition-all duration-500 delay-100 ${animatePercentage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 animate-fade-in'}`}>
                                            <div className="text-2xl font-bold text-orange-700">
                                                {idleLandPercentage}%
                                            </div>
                                            <div className="text-orange-600">Idle Land</div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add this CSS to your global CSS file or inside a <style> tag
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0);
`