import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    console.log("Received request to check game:", name);

    if (!name) {
      console.log("No game name provided");
      return NextResponse.json({ error: 'Game name is required' }, { status: 400 });
    }

    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);

    const exists = !querySnapshot.empty;
    console.log("Game exists:", exists);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Error checking game existence:', error);
    return NextResponse.json({ error: 'Error checking game existence: ' + error.message }, { status: 500 });
  }
}