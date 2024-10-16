import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { uid } = await req.json()
  if (!uid) return NextResponse.json({ message: 'UID is required' }, { status: 400 })


  try {
    let { data, error } = await supabase
      .from('builder')
      .select('*')
      .eq('id', uid)
      .limit(1)

    if (error) throw error

    if (data.length === 0) {
      const { data: newUser, error: insertError } = await supabase
        .from('builder')
        .insert([{ 
          id: uid,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Error inserting user:', insertError)
      }

      return NextResponse.json({status: 'created', user: newUser ? newUser[0] : undefined }, { status: 201 })
    } else return NextResponse.json({status: 'exists', user: data[0]}, { status: 200 })
    
  } catch (err) {
    console.error('Error checking or creating user:', err)
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}