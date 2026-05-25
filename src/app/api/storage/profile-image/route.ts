import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import stream from 'stream';
import path from 'path';

import { fail } from '@/lib/api/response';
import { getS3Client } from '@/lib/storage/s3';

async function streamToBuffer(nodeStream: stream.Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    nodeStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    nodeStream.on('end', () => resolve(Buffer.concat(chunks)));
    nodeStream.on('error', (err) => reject(err));
  });
}

function normalizeAndValidateProfileKey(rawKey: string | null) {
  if (!rawKey) return null;

  const normalized = path.posix.normalize(rawKey.replace(/\\+/g, '/'));

  if (
    !normalized.startsWith('profiles/') ||
    normalized === 'profiles/' ||
    normalized.includes('..')
  ) {
    return null;
  }

  if (normalized.startsWith('/')) {
    return null;
  }

  return normalized;
}

export async function GET(request: NextRequest) {
  try {
    const objectKey = normalizeAndValidateProfileKey(
      request.nextUrl.searchParams.get('key'),
    );

    if (!objectKey) {
      return fail('Invalid profile image key', 400);
    }

    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      return fail('S3_BUCKET not configured', 500);
    }

    const client = getS3Client();
    const res = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
    );

    const contentType =
      (res.ContentType as string) || 'application/octet-stream';
    let buf: Buffer;

    if (
      res.Body &&
      typeof (res.Body as unknown as stream.Readable).pipe === 'function'
    ) {
      buf = await streamToBuffer(res.Body as stream.Readable);
    } else if (res.Body instanceof Uint8Array) {
      buf = Buffer.from(res.Body);
    } else {
      return fail('Unexpected S3 response body type', 500);
    }

    // Detect HTML error responses (S3 endpoint misconfigured or web UI)
    if (buf.length > 0 && buf[0] === 60) {
      return fail('S3 endpoint misconfigured (returned HTML)', 502);
    }

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buf.length),
      },
    });
  } catch (error) {
    console.error('profile-image error:', error);
    return fail('Failed to load profile image', 500);
  }
}
