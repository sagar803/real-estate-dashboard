// pages/api/transcribe.js
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(req: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Read the incoming request body as a buffer
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    console.log(file)
    // Write the uploaded file to the local filesystem
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'uploads', 'output.mp3');
    fs.writeFileSync(filePath, fileBuffer);

    // Call OpenAI Whisper API to transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ["segment"],
    });

    const simplifiedSegments = transcription.segments?.map(
      ({ start, text }) => ({
        start: Math.floor(start),
        text,
      })
    );

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    console.log(transcription)

    // Return the transcription result
    return NextResponse.json({ transcription: simplifiedSegments });
  } catch (error) {
    console.error('Error during transcription:', error);
    return NextResponse.json({ error: 'Error during transcription.' }, { status: 500 });
  }
}