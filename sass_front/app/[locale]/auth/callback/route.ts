import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // This file previously handled Supabase authentication callbacks.
  // With the migration to FastAPI, this route is no longer directly used for authentication.
  // The frontend will now directly interact with FastAPI authentication endpoints.
  // If an OAuth flow is needed in the future, this route will need to be re-implemented
  // to interact with the FastAPI backend's OAuth handling.
  return NextResponse.redirect(new URL('/signin', request.url));
}
