"use client"
import { VideoToFramesMethod, VideoToFrames } from "@/components/VideoToFrames";
import { useState } from "react";

export default function App() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("IDLE");

  // Function to send frames to the API
  const sendFramesToAPI = async (base64Frames) => {
    try {
      const response = await fetch('/api/getVideoDescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Frames }),
      });

      if (!response.ok) {
        throw new Error('Failed to get video description');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending frames to API:', error);
    }
  };

  // Handle video input and process frames
  const onInput = async (event) => {
    setImages([]);
    setStatus("LOADING");

    const [file] = event.target.files;
    const fileUrl = URL.createObjectURL(file);
    
    // Get frames from the video as Base64 strings
    const frames = await VideoToFrames.getFrames(
      fileUrl,
      30,
      VideoToFramesMethod.totalFrames
    );

    console.log(frames[0]);
    // Send the Base64 frames to the API
    await sendFramesToAPI(frames);

    setStatus("IDLE");
    setImages(frames);
  };

  const now = new Date().toDateString();

  return (
    <div className="container">
      <h1>Get frames from video 🎞</h1>
      <p>Upload a video, then click the images you want to download!</p>
      <label>
        {status === "IDLE" ? (
          "Choose file"
        ) : (
          "Loading..."
        )}
        <input
          type="file"
          className="visually-hidden"
          accept="video/*"
          onChange={onInput}
        />
      </label>

      {images?.length > 0 && (
        <div className="output">
          {images.map((imageUrl, index) => (
            <a
              key={index}
              href={imageUrl}
              download={`${now}-${index + 1}.png`}
            >
              <span className="visually-hidden">
                Download image number {index + 1}
              </span>
              <img src={imageUrl} alt={`Frame ${index + 1}`} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
