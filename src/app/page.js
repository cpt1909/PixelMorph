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
    setProcessedImage(null);
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
    }
  }

  const fetchOutput = async () => {
    setProcessedImage(null);
    if (resizeOption){
      imageResizeWidth = document.getElementById("imageWidth").value;
      imageResizeHeight = document.getElementById("imageHeight").value;
    }

    const choice = document.getElementById("imageProcess").value;

    if (choice && imageFile){
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
    }else if(!imageFile){
      alert("Select an Image !!");
    }else{
      alert("Choose an option");
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
        <div>
          <img src="favicon.png" style={{width: "40px", height: "40px"}}></img>
          <h1>PixelMorph</h1>
        </div>
        
        <p style={{margin: 0}}>Redefine Your Images</p>
      </div>

      <div className="form">
        <form onSubmit={(event) => {
          event.preventDefault();
          fetchOutput()
        }}>
            <input
              id="fileInput"
              name="fileInput"
              type="file"
              accept="image/*"
              onChange={imagePreview}
            ></input>
            <label htmlFor="fileInput">
            <div className="fileInputArea">
              <img
                src={previewImage || "file-plus.svg"}
                style={{
                  minWidth: "100px",
                  maxWidth: "250px",
                  maxHeight: "300px",
                }}></img>
              <p>{previewImage ? "Image Preview" : "Select File"}</p>
              {previewImage && <p>(Click Again to Change Image)</p>}
              </div>
            </label>
            <p style={{textAlign: "center"}}>File Size Limit : 10 MB</p>            
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
              >
              <option value="" disabled={disable} required>-- Select Option --</option>
              <option value={2}>Grayscale Filter</option>
              <option value={3}>Resize Image</option>
              <option value={4}>Pencil Sketch Filter</option>
              <option value={5}>Cartoon Filter</option>
              <option value={6}>Sepia Filter</option>
              <option value={7}>Reduce Noise</option>
              <option value={1}>Face Detection</option>
              <option value={8} disabled>Object Detection (Beta)</option>
            </select>

            {resizeOption && (
            <div className="resizeField">
              <label htmlFor="imageWidth">Width : &nbsp;
              <input
                type="number"
                id="imageWidth"
                name="imageWidth"
                min={1}
                step="1"
                required
              ></input>
              &nbsp; px </label>
        
              <label htmlFor="imageHeight">Height : &nbsp;
              <input
                type="number"
                id="imageHeight"
                name="imageHeight"
                min={1}
                step="1"
                required
              ></input>
              &nbsp; px</label>
            </div>
            )}
            <button
              id="fileUpload"
              type="submit"
            ><img src="upload-light.svg" width={"20px"} height={"20px"}></img>Upload Image</button>
        </form>
      </div>

      {processedImage && (
        <div className="processedImage">
          <p>Output Image</p>
          <img
            src={processedImage}
            alt="Processed Image"
            style={{
              minWidth: "100px",
              maxWidth: "250px",
            }}
          />
        </div>
      )}

      <div>
        {processedImage && (
          <a 
            href={`${processedImage}`}
            download={"processed_image.jpg"}
            style={{textDecoration: "none"}}
          >
            <button type="button" id="fileDownload">
              <img src="download-light.svg" width={"20px"} height={"20px"}></img>Download Output</button>
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
        <p>For more details, <a href="https://github.com/cpt2004/imageprocessingtools"  target="_blank">&#9741; Visit GitHub Repo</a></p>
        <p>Copyright &copy; 2024 Thaarakenth C P</p>
      </div>
    </div>
  )};