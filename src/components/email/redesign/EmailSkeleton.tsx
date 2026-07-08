'use client';

/**
 * EmailSkeleton — Loading skeleton for Email page
 * Shows placeholder content while data loads, improving perceived performance
 */
export function EmailSkeleton() {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-96 bg-muted rounded-lg animate-pulse" />
        </div>

        {/* Main panel */}
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          {/* Left side */}
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 lg:p-10 space-y-5">
              {/* Icon */}
              <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
              
              {/* Title */}
              <div className="space-y-3">
                <div className="h-7 w-80 bg-muted rounded-lg animate-pulse" />
                <div className="h-4 w-96 bg-muted rounded-lg animate-pulse" />
                <div className="h-4 w-72 bg-muted rounded-lg animate-pulse" />
              </div>

              {/* Button */}
              <div className="pt-3 space-y-3">
                <div className="h-10 w-40 bg-muted rounded-lg animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Right side */}
            <div className="border-t border-border bg-muted p-8 lg:border-l lg:border-t-0 lg:p-10 space-y-6">
              <div className="h-3 w-32 bg-muted-600 rounded animate-pulse" />
              
              {/* Trust points */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 bg-muted rounded-lg shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-56 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
