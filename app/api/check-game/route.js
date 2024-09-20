import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const { data, error, count } = await supabase
      .from('games')
      .select('slug', { count: 'exact' })
      .eq('slug', name.toLowerCase())
      .limit(1);

    if (error) throw error;

    const exists = count > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Error checking game existence:', error);
    return NextResponse.json({ 
      error: 'Error checking game existence', 
      details: error.message 
    }, { status: 500 });
  }
}