"use client"
import React, { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Initialize FFmpeg instance
const ffmpeg = new FFmpeg({ log: true });

const VideoFrameExtractor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [encodedFrames, setEncodedFrames] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [description, setDescription] = useState('');

  // Load ffmpeg.wasm
  const loadFFmpeg = async () => {
    if (!isFFmpegLoaded) {
      await ffmpeg.load();
      setIsFFmpegLoaded(true);
    }
  };

  // Handle video file upload
  const handleVideoUpload = (e) => {
    setVideoFile(e.target.files[0]);
    setEncodedFrames([]); // Reset frames when a new file is uploaded
    setDescription(''); // Clear previous description
  };

  // Extract frames and encode to base64
  const extractAndEncodeFrames = async () => {
    if (!videoFile) return;
    setIsProcessing(true);

    await loadFFmpeg();

    // Write video file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

    // Run FFmpeg to extract frames at 1 frame per second
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', 'fps=1',
      '-vsync', '0',
      'frame-%d.png'
    ]);

    let frameNumber = 1;
    let framesInBase64 = [];

    // Read frames from FFmpeg's virtual file system and encode them
    while (true) {
      try {
        // Read frame data
        const frameData = await ffmpeg.readFile(`frame-${frameNumber}.png`);

        // Convert the frame data to base64
        const encodedFrame = encodeImage(frameData);
        framesInBase64.push(encodedFrame);

        frameNumber++;
      } catch (e) {
        break;
      }
    }

    setEncodedFrames(framesInBase64);
    setIsProcessing(false);

    // Send frames to the API for processing
    await sendFramesToAPI(framesInBase64);
  };

  // Function to encode image to base64
  const encodeImage = (frameData) => {
    return Buffer.from(frameData.buffer).toString('base64');
  };

  // Send base64 frames to the API for description generation
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
      setDescription(data.description);
    } catch (error) {
      console.error('Error sending frames to API:', error);
    }
  };

  return (
    <div>
      <h1>In-Memory Video Frame Extractor</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {videoFile && (
        <button onClick={extractAndEncodeFrames} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Extract and Encode Frames'}
        </button>
      )}

      {!isFFmpegLoaded && (
        <div>
          <button onClick={loadFFmpeg}>
            Load FFmpeg
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {encodedFrames.length > 0 && <h2>Encoded Frames</h2>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {encodedFrames.map((encodedFrame, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${encodedFrame}`}
              alt={`Frame ${index + 1}`}
              style={{ width: '150px', border: '1px solid #ccc' }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {description && (
          <>
            <h2>Generated Description</h2>
            <p>{description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoFrameExtractor;
