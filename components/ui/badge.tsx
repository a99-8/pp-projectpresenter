import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-muted text-foreground",
        variant === "outline" && "border border-border bg-card text-muted-foreground",
        variant === "accent" && "bg-accent text-accent-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
