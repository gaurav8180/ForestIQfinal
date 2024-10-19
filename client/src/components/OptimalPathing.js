import React, { useState, useEffect, useRef } from 'react';
import { Upload, Loader, X, ArrowRight } from 'lucide-react';
import axios from 'axios';

const OptimalPathing = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [grayscaleImage, setGrayscaleImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setFile(file); // Set the file for uploading
    };
    reader.readAsDataURL(file);
  };

  const [file, setFile] = useState(null);

  // Load image via file input
  const loadImage = (e) => {
    handleFile(e.target.files[0]);
  };

  const resetState = () => {
    setImageSrc(null);
    setGrayscaleImage(null);
    setResultImage(null);
    setFile(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the server returns the paths for the grayscale and result images
      setGrayscaleImage(response.data.grayscale_image);
      setResultImage(response.data.result_image);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Optimal Pathing
            </h1>
            <p className="mt-2 text-gray-400">Path detection</p>
          </div>
        </div>

        {!imageSrc ? (
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
              ref={fileInputRef}
              onChange={loadImage}
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
                id="imageSrc"
                src={imageSrc}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-[600px]"
              />
            </div>

            {!loading ? (
              <button
                onClick={handleUpload}
                className="group flex items-center justify-center w-full py-4 px-6 
                         bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium
                         transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                Upload and Process Image
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center justify-center py-4 px-6 
                            bg-emerald-500/20 rounded-xl font-medium text-emerald-400">
                <Loader className="animate-spin mr-3 h-5 w-5" />
                Processing your image...
              </div>
            )}

            {grayscaleImage && (
              <div>
                <h2>Grayscale Image</h2>
                <img src={`http://localhost:5001/${grayscaleImage}`} alt="Grayscale" className="w-full rounded-xl" />
              </div>
            )}

            {resultImage && (
              <div>
                <h2>Image with Optimal Path</h2>
                <img src={`http://localhost:5001/${resultImage}`} alt="Optimal Path" className="w-full rounded-xl" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimalPathing;
