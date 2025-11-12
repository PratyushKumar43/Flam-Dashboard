export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}
