"use client"
import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Initialize FFmpeg
const ffmpeg = new FFmpeg({ log: true });

const VideoToMp3Converter = () => {
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [transcription, setTranscription] = useState(null);

  const loadFFmpeg = async () => {
    if (!isFFmpegLoaded) {
      await ffmpeg.load();
      setIsFFmpegLoaded(true);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await loadFFmpeg();

    setIsConverting(true);
    setTranscription(null);

    // Convert video to audio (MP3)
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');
    const mp3Blob = new Blob([data.buffer], { type: 'audio/mpeg' });

    const formData = new FormData();
    formData.append('file', mp3Blob, 'output.mp3');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setTranscription(result.transcription);
      } else {
        setTranscription('Failed to transcribe audio.');
      }
    } catch (error) {
      console.error('Error during transcription:', error);
      setTranscription('Error during transcription.');
    }

    setIsConverting(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Video to MP3 Converter & Transcriber</h1>
      <input 
        type="file" 
        accept="video/mp4" 
        onChange={handleFileChange}
        disabled={isConverting}
      />
      {isConverting && <p>Converting and transcribing video...</p>}
      {transcription && (
        <div>
          <h3>Transcription Result:</h3>
          <pre>{transcription}</pre>
        </div>
      )}
    </div>
  );
};

export default VideoToMp3Converter;
