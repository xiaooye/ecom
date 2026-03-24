import { cn } from "@/lib/utils";

interface SafariFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Safari-style browser frame for showcasing content.
 * Great for product screenshots or demo previews.
 */
export function SafariFrame({
  url = "webstore.com",
  children,
  className,
}: SafariFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-2xl",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        {/* URL bar */}
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="bg-background">{children}</div>
    </div>
  );
}
