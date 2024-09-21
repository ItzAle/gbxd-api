import { auth } from "../../../lib/firebase-admin";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(idToken);
    const email = decodedToken.email;

    // Check if the user's email is gameboxdapp@gmail.com
    if (email === 'gameboxdapp@gmail.com') {
      await auth.setCustomUserClaims(decodedToken.uid, { admin: true });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "User not authorized for admin access" }, { status: 403 });
    }
  } catch (error) {
    console.error('Error in verify-admin:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
