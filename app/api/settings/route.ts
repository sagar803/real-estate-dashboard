// app/api/settings/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server'

interface Settings {
  route: string;
  chatbot_instructions: string;
}

export async function GET(request: NextRequest) {
  const builderId = request.nextUrl.searchParams.get('builderId')

  if (!builderId) {
    return NextResponse.json({ error: 'Builder ID is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('builder')
      .select('settings')
      .eq('id', builderId)
      .single()

    if (error) throw error

    return NextResponse.json(data.settings || {}, { status: 200 })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { builderId, settings }: { builderId: string; settings: Settings } = body

  if (!builderId || !settings) {
    return NextResponse.json({ error: 'Builder ID and settings are required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('builder')
      .update({ settings })
      .eq('id', builderId)

    if (error) throw error

    return NextResponse.json({ message: 'Settings updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}