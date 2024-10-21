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
    // Extract form data
    const formData = await request.formData();
    const requiredFields = ['userId', 'routeName', 'systemInstruction', 'file'];
    const optionalFields = ['bgColor', 'appName', 'imagesUrl', 'videosUrl'];

    // Create an object to hold the form data
    const data: Record<string, any> = {};
    
    // Iterate over required fields
    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
      data[field] = value;
    }

    // Process optional fields
    for (const field of optionalFields) {
      const value = formData.get(field);
      if (value) {
        data[field] = value;
      }
    }

    // Parse imagesUrl and videosUrl if present
    const imagesArray = data.imagesUrl ? JSON.parse(data.imagesUrl) : [];
    const videosArray = data.videosUrl ? JSON.parse(data.videosUrl) : [];

    // Create chatbot
    const { error: updateError } = await supabase
      .from('chatbot')
      .insert([{
        configuration: {
          route: data.routeName,
          chatbot_instruction: data.systemInstruction,
          bg_color: data.bgColor || null,
          app_name: data.appName || null,
        },
        user_id: data.userId,
      }]);

    if (updateError) throw updateError;

    // CSV file handling
    const fileContent = await (data.file as File).text();
    const records = parse(fileContent, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
    const validatedRecords = records
      .map(record => validateAndTransformRecord(record, data.routeName, imagesArray, videosArray))
      .filter((record): record is PropertyRecord => record !== null);

    const { data: propertyData, error } = await supabase
      .from('properties')
      .insert(validatedRecords);

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Upload successful', 
      count: validatedRecords.length,
      route: data.routeName
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

function validateAndTransformRecord(
  record: Record<string, string>, 
  routeName: string, 
  imagesArray: string[], 
  videosArray: string[]
): PropertyRecord | null {
  try {
    // Check if 'images' and 'videos' columns are present in the record
    const existingImages = record.images ? JSON.parse(record.images) : [];
    const existingVideos = record.videos ? JSON.parse(record.videos) : [];

    const transformedRecord: PropertyRecord = {
      route: routeName,
      meta: record.meta ? JSON.parse(record.meta) : null,
      images: existingImages.length > 0 ? [...existingImages, ...imagesArray] : imagesArray,
      ratings: record.ratings ? JSON.parse(record.ratings) : null,
      features: record.features ? JSON.parse(record.features) : null,
      link: record.link || null,
      videos: existingVideos.length > 0 ? [...existingVideos, ...videosArray] : videosArray,
    };

    return transformedRecord;
  } catch (error) {
    console.error('Error validating record:', error, record);
    return null;
  }
}
