// @ts-nocheck
// app/api/videoDescription/route.js
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { NextResponse } from 'next/server';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';


// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Create the directory to store uploaded videos
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create the directory to store extracted frames
const framesDir = path.join(process.cwd(), 'frames');
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

async function saveFile(req) {
  const fileName = `uploaded-${Date.now()}.mp4`;
  const filePath = path.join(uploadDir, fileName);

  // Write the file stream to disk
  const fileStream = fs.createWriteStream(filePath);

  // Read the request body stream
  const reader = req.body.getReader();
  let { done, value } = await reader.read();

  while (!done) {
    fileStream.write(Buffer.from(value));
    ({ done, value } = await reader.read());
  }

  fileStream.end();
  return filePath;
}

// Route handler for video processing
export async function POST(req) {
  try {
    // Save the uploaded video file
    const videoPath = await saveFile(req);

    // Extract frames from the video
    await extractFrames(videoPath, framesDir);

    return NextResponse.json({ message: 'Frames extracted successfully' });
  } catch (err) {
    console.error('Error occurred:', err.message);
    return NextResponse.json({ message: 'Failed to extract frames' }, { status: 500 });
  }
}

// Helper function to extract frames from the video
// async function extractFrames(videoPath, outputDir) {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .output(path.join(outputDir, 'frame-%04d.png'))
//       .outputOptions(['-vf', 'fps=0.5', '-vsync', '0'])
//       .on('end', resolve)
//       .on('error', (err) => {
//         console.error('FFmpeg error:', err.message);
//         reject(err);
//       })
//       .run();
//   });
// }

async function extractFrames(videoPath, outputDir) {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn(ffmpegPath, [
      "-i",
      videoPath,
      "-vf",
      "-vsync",
      "0",
      "-frame_pts",
      "1",
      "-frames:v",
      frameCount.toString(),
      path.join(outputDir, "frame-%d.png"),
    ]);

    ffmpegProcess.stderr.on("data", (data) => {
      console.log(`ffmpeg: ${data}`);
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });
  });
}
