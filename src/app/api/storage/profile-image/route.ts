import { NextRequest, NextResponse } from 'next/server';

import { fail } from '@/lib/api/response';
import { getProfileImagePresignedUrl } from '@/lib/storage/s3';

export async function GET(request: NextRequest) {
  try {
    const objectKey = request.nextUrl.searchParams.get('key');

    if (!objectKey) {
      return fail('key query parameter is required', 400);
    }

    if (!objectKey.startsWith('profiles/')) {
      return fail('Invalid profile image key', 400);
    }

    const url = await getProfileImagePresignedUrl(objectKey);

    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error('Error serving profile image:', error);
    return fail('Failed to load profile image', 500);
  }
}