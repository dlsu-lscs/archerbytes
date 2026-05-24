import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client: S3Client | null = null;
let bucketReadyPromise: Promise<void> | null = null;
let bucketReady = false;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required S3 environment variable: ${name}`);
  }

  return value;
}

function buildProfileImageRouteUrl(objectKey: string) {
  return `/api/storage/profile-image?key=${encodeURIComponent(objectKey)}`;
}

function sanitizeFileName(name: string) {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned || 'profile-image';
}

function getObjectKey(fileName: string, userId: string) {
  return `profiles/${userId}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

function isMissingBucketError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const typedError = error as { name?: string; $metadata?: { httpStatusCode?: number } };

  return (
    typedError.name === 'NoSuchBucket' ||
    typedError.name === 'NotFound' ||
    typedError.$metadata?.httpStatusCode === 404
  );
}

export function getS3Client() {
  if (s3Client) {
    return s3Client;
  }

  const endpoint = getRequiredEnv('S3_ENDPOINT');
  const region = getRequiredEnv('S3_REGION');
  const accessKeyId = getRequiredEnv('S3_ACCESS_KEY_ID');
  const secretAccessKey = getRequiredEnv('S3_SECRET_ACCESS_KEY');

  s3Client = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

export async function ensureBucket() {
  if (bucketReady) {
    return;
  }

  if (!bucketReadyPromise) {
    bucketReadyPromise = (async () => {
      const bucket = getRequiredEnv('S3_BUCKET');
      const client = getS3Client();

      try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
      } catch (error) {
        if (!isMissingBucketError(error)) {
          throw error;
        }

        await client.send(
          new CreateBucketCommand({
            Bucket: bucket,
          }),
        );
      }

      bucketReady = true;

    })().catch((error) => {
      bucketReadyPromise = null;
      throw error;
    });
  }

  await bucketReadyPromise;
}

export async function uploadProfileImage(
  file: File,
  userId: string,
): Promise<{ objectKey: string; imageUrl: string }> {
  await ensureBucket();

  const bucket = getRequiredEnv('S3_BUCKET');
  const client = getS3Client();
  const objectKey = getObjectKey(file.name, userId);
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: file.type,
    }),
  );

  return {
    objectKey,
    imageUrl: buildProfileImageRouteUrl(objectKey),
  };
}

export async function deleteProfileImage(objectKey: string) {
  const bucket = getRequiredEnv('S3_BUCKET');
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
  );
}

export async function getProfileImagePresignedUrl(objectKey: string) {
  const bucket = getRequiredEnv('S3_BUCKET');
  const client = getS3Client();

  return await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
    {
      expiresIn: 60 * 5,
    },
  );
}