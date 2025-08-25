import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "brand" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = "brand",
  size = "md",
  className
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    brand: "bg-brand",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error"
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-card-foreground">{label}</span>}
          {showValue && <span className="text-sm text-text-muted">{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("transition-all duration-1000 ease-out rounded-full", colorClasses[color], sizeClasses[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};