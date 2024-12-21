"use client";
import { useState, useEffect } from "react";
import Loader from './components/Loader'
import './globals.css'

export default function Home() {
  const apiUrl = "https://imageprocessingserver.onrender.com/imageProcessing";
  // const apiUrl = "http://127.0.0.1:8000/imageProcessing";

  const checkStatus = async () => {
    try{
      const response = await fetch(`${apiUrl}`)
      setServerStatus("Online");
    }catch(error){
      setServerStatus("Offline");
    }
  }

  useEffect(() => {
    checkStatus();
  },[]);

  const [disable, setDisable] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const [resizeOption, setResizeOption] = useState(false);
  let imageResizeWidth = null;
  let imageResizeHeight = null;

  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("Connecting");
  
  const imagePreview = (e) => {
    setProcessedImage(false);
    const file = e.target.files[0];
    if (file){
      const fileSize = file.size;
      if (fileSize > 10485760){
        alert("File Size Limit Exceeded !!");
      }else{
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }else{
      alert("Select an Image !!");
    }
  }

  const fetchOutput = async () => {
    setProcessedImage(null);
    if (resizeOption){
      imageResizeWidth = document.getElementById("imageWidth").value;
      imageResizeHeight = document.getElementById("imageHeight").value;
    }

    const choice = document.getElementById("imageProcess").value;

    if (imageFile){
      try{
        setLoading(true);

        const dim = {
          width: imageResizeWidth,
          height: imageResizeHeight,
        };

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("dim", JSON.stringify(dim));
        formData.append("choice", choice)

        const response = await fetch(`${apiUrl}`,
          {
            method: "POST",
            body: formData,
          });

        setServerStatus("Online");

        if (response.status == 200) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
          setLoading(false);
        }else{
          alert("Client Error : Invalid Request")
          setLoading(false);
        }

      }catch(error){
        alert("Server Error : Couldn't connect to Server !!");
        setServerStatus("Offline");
        setLoading(false);
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
        <h1>PixelMorph</h1>
        <p>Redefine Your Images</p>
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
            <p style={{textAlign: "center"}}>( File Size Limit : 10 MB )</p>            
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
        {previewImage && (
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
              src={processedImage}
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
            href={`${processedImage}`}
            download={"processed_image.jpg"}
          >
            <button type="button">Download Output</button>
          </a>
        )}
      </div>
      <div className="serverStatus">
        <p>Server Status :
          {(serverStatus === "Connecting") ? (
            <strong style={{color: "orange"}}> {serverStatus} </strong>) : (
              serverStatus === "Online") ? (
                <strong style={{color: "green"}}> {serverStatus} </strong> ) : (
                  <strong style={{color: "red"}}> {serverStatus} </strong>
          )}
          </p>
      </div>
      <div className="footer">
        <p style={{textAlign: "center"}}>For more details, <a href="https://github.com/cpt2004/imageprocessingtools">Visit GitHub Repo</a></p>
      </div>
    </div>
  )};