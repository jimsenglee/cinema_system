import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "default" | "centered" | "diagonal" | "subtle";
  className?: string;
}

export const AnimatedBackground = ({
  variant = "default",
  className,
}: AnimatedBackgroundProps) => {
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      {variant === "default" && (
        <>
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-neon" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
        </>
      )}
      {variant === "centered" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </>
      )}
      {variant === "diagonal" && (
        <>
          <div className="absolute -top-1/2 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
        </>
      )}
      {variant === "subtle" && (
        <>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-3xl" />
        </>
      )}
    </div>
  );
};
