
# PixelMorph - Redefine Your Images         

SERVER STATUS : 🟢 ONLINE
<!--SERVER STATUS : 🔴 OFFLINE-->
##

PixelMorph is a simple yet powerful web-based image processing tool built with Next.js. This tool allows users to upload an image and apply various transformations including face detection, grayscale conversion, image resizing, pencil sketch effects, cartoon filters, sepia filters, and noise reduction. It leverages an API backend to process the image and return the result.

## Features
1. Face Detection: Detects human faces in the image and highlights them.
2. Grayscale Conversion: Converts the uploaded image into black and white.
3. Image Resizing: Allows users to resize their images by specifying width and height (in pixels).
4. Pencil Sketch: Converts the image into a pencil sketch effect.
5. Cartoon Filter: Applies a cartoon-like effect to the image.
6. Sepia Filter: Applies a sepia tone to give images a vintage look.
7. Noise Reduction: Reduces noise in the uploaded image for better clarity.
8. Object Detection (Beta): Detects multiple classes of objects in the image (Temporarily suspended due to insufficient compute).

## Local Deployment
1. Clone the repository to your local machine:

```bash
git clone https://github.com/cpt2004/imageprocessingtools.git
```

2. Navigate to the project folder:

```bash
cd imageprocessingtools
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in your browser by going to

```bash
http://localhost:3000
```
## Usage
1. Upload an image by selecting the "Upload" button.
2. Choose an image processing option from the dropdown.
3. If you select the "Resize Image" option, input the desired width and height.
4. The processed image will appear below the upload section.
5. Download the processed image by clicking the "Download Output" button.

## Tech Stack
1. Frontend: React.js (Next.js)
2. Backend API: Custom [Image Processing Server](https://github.com/cpt2004/imageProcessingServer) built on Python Django
4. Deployment: Render (for backend API), Vercel (for frontend)
3. Styling: CSS (global styles)

## License
This project is open source and available under the MIT License.

## Contributing
Feel free to fork this repository, submit issues, and create pull requests. Contributions are welcome!
