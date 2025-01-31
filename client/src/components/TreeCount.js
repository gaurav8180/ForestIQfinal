import React, { useState, useCallback } from 'react';
import { Upload, Trees, Loader, ArrowRight, X } from 'lucide-react';

export default function TreeCount() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [preprocessedImage, setPreprocessedImage] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const BACKEND_URL = 'https://forestiqfinal-backend.onrender.com'; // Updated API base URL

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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
    setOutput('');
    setPreprocessedImage('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resetState = () => {
    setFile(null);
    setImagePreview('');
    setOutput('');
    setPreprocessedImage('');
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setAnalyzing(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        setPreprocessedImage(reader.result);

        try {
          const response = await fetch(`${BACKEND_URL}/api/tree-count/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: reader.result }),
          });

          const data = await response.json();
          setOutput(`${data.predictions.length} trees detected`);

          setTimeout(() => drawBoundingBoxes(data.predictions), 100);
        } catch (error) {
          console.error('Error:', error);
          setOutput('Error processing image');
        } finally {
          setLoading(false);
          setAnalyzing(false);
        }
      };
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const drawBoundingBoxes = (predictions) => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!imagePreview) return;

    const image = new Image();
    image.src = imagePreview;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      predictions.forEach(({ x, y, width, height }) => {
        ctx.strokeRect(x - width / 2, y - height / 2, width, height);
      });
    };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Tree Counter
            </h1>
            <p className="mt-2 text-gray-400">Advanced tree detection</p>
          </div>
          <Trees className="h-12 w-12 text-emerald-400" />
        </div>

        {!file ? (
          <div
            className={`relative rounded-xl border-2 p-12
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
                <Upload className="h-8 w-8 text-emerald-400" />
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
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75  transition-colors duration-200 backdrop-blur-sm"
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
                         bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium
                         transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                Analyze Image
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center justify-center py-4 px-6 
                            bg-emerald-500/20 rounded-xl font-medium text-emerald-400">
                <Loader className="animate-spin mr-3 h-5 w-5" />
                Processing your image...
              </div>
            )}

            {output && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-4">{output}</h3>
                  <canvas id="canvas" className="w-full rounded-lg" />
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
