'use client';

export function ToolSkeleton() {
  return (
    <div className="flex flex-col bg-[#fafafa] font-sans relative min-h-screen">
      {/* Header skeleton */}
      <header className="border-b border-border/50 py-3.5 bg-white/80 backdrop-blur-md shrink-0 z-50 sticky top-0">
        <div className="container-width flex items-center justify-between gap-4">
          <div className="h-8 w-32 bg-muted rounded-md animate-pulse" />
          <div className="flex-1 min-w-0 h-6 bg-muted rounded-md animate-pulse mx-4" />
          <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="container-width relative z-10 mx-auto w-full py-6 md:py-8 max-w-2xl">
        <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
          {/* Step indicator skeleton */}
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-border/40">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                  {i < 4 && <div className="w-8 h-1 bg-muted animate-pulse mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content area skeleton */}
          <div className="px-6 md:px-8 py-6 md:py-8 space-y-4">
            <div className="h-6 bg-muted rounded-md animate-pulse w-3/4" />
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-md animate-pulse" />
              <div className="h-4 bg-muted rounded-md animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded-md animate-pulse w-4/6" />
            </div>
            <div className="h-32 bg-muted rounded-lg animate-pulse mt-6" />
          </div>

          {/* Footer skeleton */}
          <div className="px-6 md:px-8 py-3.5 border-t border-border/40 bg-muted/20">
            <div className="h-3 bg-muted rounded-md animate-pulse w-2/3 mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
