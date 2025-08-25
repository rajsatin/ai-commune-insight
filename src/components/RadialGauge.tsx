import { cn } from "@/lib/utils";

interface RadialGaugeProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  label?: string;
  color?: "brand" | "success" | "warning" | "error";
  className?: string;
}

export const RadialGauge = ({
  value,
  max = 100,
  size = "md",
  showValue = true,
  label,
  color = "brand",
  className
}: RadialGaugeProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = size === "sm" ? 40 : size === "md" ? 60 : 80;
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  const colorClasses = {
    brand: "stroke-brand",
    success: "stroke-success", 
    warning: "stroke-warning",
    error: "stroke-error"
  };

  const svgSize = radius * 2 + strokeWidth * 2;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        <svg
          height={svgSize}
          width={svgSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="hsl(var(--muted))"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
          {/* Progress circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            className={cn("transition-all duration-1000 ease-out", colorClasses[color])}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn(
                "font-bold text-card-foreground",
                size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl"
              )}>
                {Math.round(value)}
              </div>
              <div className={cn(
                "text-text-muted text-xs",
                size === "lg" && "text-sm"
              )}>
                / {max}
              </div>
            </div>
          </div>
        )}
      </div>
      {label && (
        <div className="text-sm text-text-muted text-center font-medium">
          {label}
        </div>
      )}
    </div>
  );
};