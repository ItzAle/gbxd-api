import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);

    const exists = !querySnapshot.empty;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Error checking game existence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}