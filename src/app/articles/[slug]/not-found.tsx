import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center grow gap-4 py-20 text-neutral-950">
      <h1 className="text-4xl font-bold">Article not found</h1>
      <p className="text-neutral-500">
        The article you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/" className="underline text-blue-500 text-sm">
        Back to home
      </Link>
    </div>
  );
}
