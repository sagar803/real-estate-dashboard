import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { supabase } from '@/lib/supabaseClient';

interface PropertyRecord {
  id?: number;
  route: string | null;
  meta: Record<string, any> | null;
  images: string[] | null;
  ratings: Record<string, number> | null;
  features: string[] | null;
  link: string | null;
  videos: string[] | null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string | null;
    const routeName = formData.get('routeName') as string | null;
    const systemInstruction = formData.get('systemInstruction') as string | null;
    const file = formData.get('file') as File | null;
    const bgColor = formData.get('bgColor') as string;
    const appName = formData.get('appName') as string;
    const imagesArray = formData.get('imagesUrl') as string | null;
    const videosArray = formData.get('videosUrl') as string | null;
    
    let parsedImagesArray: string[] = [];
    let parsedVideosArray: string[] = [];
    
    if (imagesArray) parsedImagesArray = JSON.parse(imagesArray) as string[];
    if (videosArray) parsedVideosArray = JSON.parse(videosArray) as string[];
  
    

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'Builder ID is required' }, { status: 400 });
    if (!routeName) return NextResponse.json({ error: 'Route name is required' }, { status: 400 });
    if (!systemInstruction) return NextResponse.json({ error: 'System instruction is required' }, { status: 400 });

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

    // CSV file handling
    const fileContent = await file.text();
    const records = parse(fileContent, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
    const validatedRecords = records
      .map(record => validateAndTransformRecord(record, routeName, parsedImagesArray, parsedVideosArray))
      .filter((record): record is PropertyRecord => record !== null);

    const { data, error } = await supabase
      .from('properties')
      .insert(validatedRecords);

    if (error) throw error;

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

function validateAndTransformRecord(record: Record<string, string>, routeName: string, imagesArray: string[], videosArray: string[]): PropertyRecord | null {
  try {
    const existingImages = record.images ? JSON.parse(record.images) : [];
    const existingVideos = record.videos ? JSON.parse(record.videos) : [];

    const transformedRecord: PropertyRecord = {
      route: routeName,
      meta: record.meta ? JSON.parse(record.meta) : null,
      images: [...existingImages, ...imagesArray],
      ratings: record.ratings ? JSON.parse(record.ratings) : null,
      features: record.features ? JSON.parse(record.features) : null,
      link: record.link || null,
      videos: [...existingVideos, ...videosArray],
    };

    return transformedRecord;
  } catch (error) {
    console.error('Error validating record:', error, record);
    return null;
  }
}
