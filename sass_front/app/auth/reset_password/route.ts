import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // This file previously handled Supabase password reset callbacks.
  // With the migration to FastAPI, this route is no longer directly used for password resets.
  // The frontend will now directly interact with FastAPI password reset endpoints.
  // If a password reset flow is needed in the future, this route will need to be re-implemented
  // to interact with the FastAPI backend's password reset handling.
  return NextResponse.redirect(new URL('/signin', request.url));
}
