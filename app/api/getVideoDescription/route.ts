//@ts-nocheck
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Configure the route for body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Increase limit to handle large frames
    },
  },
};

// Handle POST requests for the API
export async function POST(req: NextRequest) {
  try {
    const { base64Frames } = await req.json();

    if (!base64Frames || !Array.isArray(base64Frames)) {
      return NextResponse.json(
        { error: 'Invalid or missing frames' },
        { status: 400 }
      );
    }

    // Prepare messages for GPT-4
    const messages = [
      {
        role: 'user',
        content: [
            "You are analyzing a series of video frames captured at 1-second intervals. Your task is to generate a concise description of the video content, based on the visual details observed in these frames.",
            "Please consider the following guidelines:",
            "- Include relevant details about the background, foreground, and any visible interactions between elements.",
            "- If there are any visible texts, signs, or symbols, include them in the description.",
            "- Mention any changes or transitions that occur between frames (e.g., movement, shifts in focus, or changes in scenery).",
            "- Ensure the description is structured as a single cohesive paragraph, maintaining the flow and order of the frames.",

          ...base64Frames.map((frame) => ({
            image: frame,
            resize: 768,
          })),
        ],
      },
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 2000,
      });
      
    // Get the response from OpenAI
    console.log(response.choices[0]?.message?.content)
    const description = response.choices[0]?.message?.content;

    if (!description) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    // Return the generated description
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error processing video frames:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
