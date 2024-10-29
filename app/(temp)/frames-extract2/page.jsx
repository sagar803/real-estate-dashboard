"use client"
import { useState } from 'react';

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      setMessage('Uploading video...');
      const response = await fetch('/api/videoDescription', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Video uploaded and frames extracted successfully.');
        console.log('Frame timestamps:', data.frameTimestamps);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload Video File</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!videoFile}>
        Upload Video
      </button>
      <p>{message}</p>
    </div>
  );
}
