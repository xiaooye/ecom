import { cn } from "@/lib/utils";

interface IPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * iPhone-style device frame for mobile preview mockups.
 * Shows content inside a phone outline with notch and home indicator.
 */
export function IPhoneFrame({ children, className }: IPhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] rounded-[2.5rem] border-[6px] border-neutral-800 bg-neutral-800 p-1 shadow-xl dark:border-neutral-700",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-neutral-800 dark:bg-neutral-700" />

      {/* Screen */}
      <div className="relative overflow-hidden rounded-[2rem] bg-background">
        <div className="h-[560px] overflow-y-auto">{children}</div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-neutral-600" />
    </div>
  );
}
