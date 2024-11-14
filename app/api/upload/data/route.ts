import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
interface PropertyRecord {
  id?: number;
  route: string | null;
  meta: Record<string, string>;
  images: Array<{ url: string, description: string }> | null;
  ratings: Record<string, string> | null;
  features: string[] | null;
  link: string | null;
  videos: Array<{ url: string, description: string }> | null;
}

const RatingSchema = z.object({}).catchall(z.string());
const MetaSchema = z.object({}).catchall(z.string());
const FeaturesSchema = z.object({
  features: z.array(z.string())
});


type VideoFile = {
  url: string
  description: string
  propertyIndex: number
  fileType: string
  aiDescription: string
  transcript: []  
}

type ImageFile = {
  url: string
  description: string
  propertyIndex: number
  fileType: string
}

type UploadedFile = ImageFile | VideoFile

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string | null;
    const routeName = formData.get('routeName') as string | null;
    const systemInstruction = formData.get('systemInstruction') as string | null;
    const file = formData.get('file') as File | null;
    const bgColor = formData.get('bgColor') as string;
    const appName = formData.get('appName') as string;

    const uploadedFiles = formData.get('uploadedFiles') as string;

    
    let parsedFiles: UploadedFile[] = [];
    if (uploadedFiles) parsedFiles = JSON.parse(uploadedFiles) as UploadedFile[];

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'Builder ID is required' }, { status: 400 });
    if (!routeName) return NextResponse.json({ error: 'Route name is required' }, { status: 400 });
    if (!systemInstruction) return NextResponse.json({ error: 'System instruction is required' }, { status: 400 });

    const filesByPropertyIndex: Record<number, UploadedFile[]> = {};
    parsedFiles.forEach(file => {
      const index = file.propertyIndex - 1;
      if (!filesByPropertyIndex[index]) {
        filesByPropertyIndex[index] = [];
      }
      filesByPropertyIndex[index].push(file);
    });
    
    // CSV file handling
    const fileContent = await file.text();
    const records = parse(fileContent, { columns: true, skip_empty_lines: true }) as Record<string, string>[];

    // const validatedRecords = records
    //   .map((record, index) => 
    //     validateAndTransformRecord(record, routeName, filesByPropertyIndex[index] || [])
    //   )
    //   .filter((record): record is PropertyRecord => record !== null);

    const validatedRecords = (
      await Promise.all(
        records.map((record, index) =>
          validateAndTransformRecord(record, routeName, filesByPropertyIndex[index] || [])
        )
      )
    ).filter((record): record is PropertyRecord => record !== null);

    
    const { data, error } = await supabase
      .from('properties')
      .insert(validatedRecords);

    if (error) throw error;

    // Create chatbot
    const { error: updateError } = await supabase
      .from('chatbot')
      .insert([{
        configuration: {
          route: routeName,
          chatbot_instruction: systemInstruction,
          bg_color: bgColor,
          app_name: appName,
        },
        user_id: userId,
      }]);

    if (updateError) throw updateError; 


    return NextResponse.json({ 
      message: 'Upload successful', 
      count: validatedRecords.length,
      route: routeName
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function validateAndTransformRecord(
  record: Record<string, string>, 
  routeName: string, 
  uploadedFiles: UploadedFile[] = []
) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const existingImages = record.images ? JSON.parse(record.images) : [];
    const existingVideos = record.videos ? JSON.parse(record.videos) : [];

    if(!record.meta) throw new Error('Missing metadata');
    if(!record.ratings) throw new Error('Missing ratings');
    if(!record.features) throw new Error('Missing features');
 
    let parsedMeta;
    try{
      parsedMeta = JSON.parse(record.meta)
    } catch(err) {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "Transform the data to be in correct schema, empty string should remain empty if relevant data is not found" },
          { role: "user", content: `${record.meta}` },
        ],
        response_format: zodResponseFormat(MetaSchema, "meta"),
      });
      parsedMeta = completion.choices[0].message.parsed;
    }
    console.log("parsedMeta: ", parsedMeta)

    let parsedRatings;
    try{
      parsedRatings = JSON.parse(record.ratings)
    } catch(err) {
      console.log(err)
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "Transform the data to be in correct schema, empty string should remain empty if relevant data is not found" },
          { role: "user", content: `${record.ratings}` },
        ],
        response_format: zodResponseFormat(RatingSchema, "ratings"),
      });
      parsedRatings = completion.choices[0].message.parsed;
    }
    console.log("parsedRatings: ", parsedRatings)

    let parsedFeatures;
    try {
      parsedFeatures = JSON.parse(record.features);
    } catch (err) {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Format the provided features into an array of strings." },
          { role: "user", content: `Here are the features: ${record.features}` }
        ],
        response_format: zodResponseFormat(FeaturesSchema, "features")
      });
      parsedFeatures = completion.choices[0].message.parsed?.features || [];
        // FeaturesSchema.parse(parsedFeatures); // Re-validate the corrected features
    }
    console.log("parsedFeatures: ", parsedFeatures)

    // Filter and group uploaded files by type
    const images = uploadedFiles
      .filter(file => file.fileType === 'images')
      .map(file => ({ url: file.url, description: file.description }));

    const videos = uploadedFiles
      .filter(file => file.fileType === 'videos')
      .map(file => ({ url: file.url, description: file.description, transcript: file.transcript, aiDescription: file.aiDescription }));

    const transformedRecord: PropertyRecord = {
      route: routeName,
      meta: parsedMeta,
      ratings: parsedRatings,
      features: parsedFeatures,
      link: record.link || null,
      images: [...existingImages, ...images],
      videos: [...existingVideos, ...videos],
    };

    return transformedRecord;
  } catch (error) {
    console.error('Error validating record:', error);
    return null;
  }
}
