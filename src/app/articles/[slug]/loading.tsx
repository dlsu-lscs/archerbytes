export default function ArticleLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10 bg-neutral-50">
      <div className="hidden lg:flex justify-end" />
      <main className="flex flex-col gap-[30px] px-10">
        <section className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-4 pt-3 mb-3 animate-pulse">
            <div className="h-4 w-48 bg-neutral-200 rounded" />
            <div className="h-4 w-24 bg-neutral-200 rounded" />
            <div className="h-10 w-full bg-neutral-200 rounded" />
            <div className="h-10 w-3/4 bg-neutral-200 rounded" />
            <div className="flex gap-3 items-center">
              <div className="size-12 rounded-full bg-neutral-200" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-24 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="h-64 w-full bg-neutral-200 rounded-xl" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-neutral-200 rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
