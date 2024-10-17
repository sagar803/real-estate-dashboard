import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    // Check if UID is provided
    if (!uid) return NextResponse.json({ message: 'UID is required' }, { status: 400 });
  
    const { data, error: selectError } = await supabase
      .from('builder')
      .select('*')
      .eq('id', uid);

    if (selectError) throw selectError;

    if (data && data.length === 0) {
      const { data: newUser, error: insertError } = await supabase
        .from('builder')
        .insert([{ id: uid }])
        .select('*')
      if (insertError) throw insertError;

      return NextResponse.json({ status: 'created', user: newUser[0] }, { status: 201 });
    }

    return NextResponse.json({ status: 'exists', user: data[0] }, { status: 200 });

  } catch (err) {
    console.error('Error checking or creating user:', err);
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
