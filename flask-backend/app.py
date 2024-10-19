from flask import Flask, request, jsonify, send_from_directory
import os
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from flask_cors import CORS
from ImageSegmentation import ImageSeg
from OptimalPathfinding import OptimalPathing

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return "Welcome to the Image Pathfinding API!"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    
    # Step 1: Image Segmentation
    obj = ImageSeg(filepath)
    thresholded_img = obj.IsoGrayThresh()  # Get the thresholded binary image

    # Save the grayscale image
    grayscale_path = os.path.join(app.config['UPLOAD_FOLDER'], 'grayscale.png')
    plt.imsave(grayscale_path, thresholded_img, cmap='gray')  # Save the grayscale image

    # Load the original image using PIL to ensure we can modify pixel values easily
    original_img = Image.open(filepath).convert('RGB')  # Convert to RGB if needed
    img_array = np.array(original_img)  # Convert to a numpy array

    # Step 2: Optimal Pathfinding
    pathing_obj = OptimalPathing(thresholded_img, filepath)  # Pass the original image path
    shortest_path = pathing_obj.ComputeDijkstra()  # Compute the shortest path

    # Mark the path on the original image array
    for point in shortest_path:
        if 0 <= point[0] < img_array.shape[0] and 0 <= point[1] < img_array.shape[1]:
            img_array[point] = [255, 0, 0]  # Mark the path in red (RGB)

    # Save the result image with the path
    result_path = os.path.join(app.config['UPLOAD_FOLDER'], 'result.png')
    plt.imsave(result_path, img_array)  # Save the processed image with path

    return jsonify({
        'grayscale_image': 'uploads/grayscale.png',
        'result_image': 'uploads/result.png'
    })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
