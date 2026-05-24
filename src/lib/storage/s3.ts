import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;
let bucketReadyPromise: Promise<void> | null = null;
const POLICY_VERSION = '2012-10-17';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required S3 environment variable: ${name}`);
  }

  return value;
}

function normalizeEndpoint(endpoint: string) {
  return endpoint.replace(/\/$/, '');
}

function buildPublicObjectUrl(endpoint: string, bucket: string, objectKey: string) {
  return new URL(`${bucket}/${objectKey}`, `${normalizeEndpoint(endpoint)}/`).toString();
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
  if (!bucketReadyPromise) {
    bucketReadyPromise = (async () => {
      const bucket = getRequiredEnv('S3_BUCKET');
      const client = getS3Client();

      try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
      } catch {
        await client.send(
          new CreateBucketCommand({
            Bucket: bucket,
          }),
        );
      }

      const bucketPolicy = {
        Version: POLICY_VERSION,
        Statement: [
          {
            Sid: 'PublicReadForProfileImages',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/profiles/*`],
          },
        ],
      };

      await client.send(
        new PutBucketPolicyCommand({
          Bucket: bucket,
          Policy: JSON.stringify(bucketPolicy),
        }),
      );

    })().catch((error) => {
      bucketReadyPromise = null;
      throw error;
    });
  }

  await bucketReadyPromise;
}

export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  await ensureBucket();

  const bucket = getRequiredEnv('S3_BUCKET');
  const endpoint = normalizeEndpoint(getRequiredEnv('S3_ENDPOINT'));
  const client = getS3Client();
  const objectKey = getObjectKey(file.name, userId);
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: file.type,
      ACL: 'public-read',
    }),
  );

  return buildPublicObjectUrl(endpoint, bucket, objectKey);
}