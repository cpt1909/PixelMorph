"use client";
import { useState, useEffect } from "react";
import Loader from './components/Loader'
import './globals.css'

export default function Home() {
  const apiUrl = "https://imageprocessingapi-kijs.onrender.com";
  // const apiUrl = "http://127.0.0.1:8000";

  const [disable, setDisable] = useState(false);

  const [base64String, setBase64String] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);

  const [resizeOption, setResizeOption] = useState(false)
  let imageResizeWidth = null;
  let imageResizeHeight = null;

  const [loading, setLoading] = useState(false);
  
  const imagePreview = (e) => {
    setProcessedImage(false);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const img = new Image();

      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setBase64String(base64);
        setPreviewImage(reader.result);
      };

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };

      reader.readAsDataURL(file)
    }
  };

  const fetchOutput = async () => {
    setProcessedImage(null);
    if (resizeOption){
      imageResizeWidth = document.getElementById("imageWidth").value;
      imageResizeHeight = document.getElementById("imageHeight").value;
    }

    const choice = document.getElementById("imageProcess").value;

    if (base64String){
      setLoading(true);
      const response = await fetch(`${apiUrl}/imageProcessing`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      'image': base64String,
                      'choice': choice,
                      'dim': {
                        'width': imageResizeWidth,
                        'height': imageResizeHeight,
                      }
                    })
                  });
    const e = await response.json();
    if (response.status == 200){
      setProcessedImage(e.output);
      setLoading(false);
    }else{
      setLoading(false);
      alert(`${e.message}`)
    }
    
    }else{
      alert("Select an Image !!");
    }
  }

  return (
    <div className="main">
      {loading && (
        <div className="loadingOverlay">
          <Loader/>
          <p>Please Wait ...</p>
        </div>
      )}
      
      <div className="header">
        <h1>Image Processing Tool</h1>
        <p>( File Size Limit : 10 MB )</p>
      </div>
      
      <hr/>

      <div className="form">
        <form onSubmit={(event) => {
          event.preventDefault();
          fetchOutput()
        }}>
            <input
              type="file"
              accept="image/*"
              onChange={imagePreview}
              required
            ></input>

            <select
              id="imageProcess"
              name="imageProcess"
              onChange={() => {
                setDisable(true);
                setProcessedImage(null);
                if (document.getElementById("imageProcess").value == 3){
                  setResizeOption(true);
                }else{
                  setResizeOption(false);
                }
              }}
              required>
              <option value="" disabled={disable} required>--Select--</option>
              <option value={1}>Face Detection</option>
              <option value={2}>Grayscale Image</option>
              <option value={3}>Resize Image</option>
              <option value={4}>Pencil Sketch</option>
              <option value={5}>Cartoon Filter</option>
              <option value={6}>Apply Sepia</option>
              <option value={7}>Reduce Noise</option>
              <option value={8} disabled>Object Detection (Beta)</option>
            </select>

            <div>
            {resizeOption && (
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="imageWidth">Width : </label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="imageWidth"
                        name="imageWidth"
                        placeholder={previewImage && (` pixels (px) `)}
                        // placeholder={previewImage && (`${imageWidth/10} - ${imageWidth}`)}
                        // min={imageWidth/10}
                        // max={imageWidth}
                        step="1"
                        required
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="imageHeight">Height : </label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="imageHeight"
                        name="imageHeight"
                        placeholder={previewImage && (` pixels (px) `)}
                        // placeholder={previewImage && (`${imageHeight/10} - ${imageHeight}`)}
                        // min={imageHeight/10}
                        // max={imageHeight}
                        step="1"
                        required
                      ></input>
                    </td>
                  </tr>
                </tbody>
              </table>                
            )}
            </div>
            <button 
              type="submit"
            >Upload</button>
        </form>
      </div>
      
      <div className="fileDisplay">
        {base64String && (
          <div>
          <p>Image Preview</p>
          <img
            src={previewImage}
            alt="Uploaded Image"
            style={{
              minWidth: "100px",
              maxWidth: "300px",
              width: "auto",
              height: "auto",
            }}
            />
          </div>
        )}

        {processedImage && (
          <div>
            <p>Output Image</p>
            <img
              src={`data:image/png;base64,${processedImage}`}
              alt="Processed Image"
              style={{
                minWidth: "100px",
                maxWidth: "300px",
                width: "auto",
                height: "auto",
              }}
            />
          </div>
        )}
      </div>
      <div>
        {processedImage && (
          <a 
            href={`data:image/png;base64,${processedImage}`}
            download={"processed_image.jpg"}
          >
            <button type="button">Download Output</button>
          </a>
        )}
      </div>
      <div className="footer">
        {processedImage && (
          <hr/>
        )}
      </div>
    </div>
  )};