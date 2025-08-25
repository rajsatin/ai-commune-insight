import { cn } from "@/lib/utils";

interface DonutData {
  label: string;
  value: number;
  color?: "brand" | "success" | "warning" | "error" | "muted";
}

interface DonutChartProps {
  data: DonutData[];
  size?: "sm" | "md" | "lg";
  showLegend?: boolean;
  centerContent?: React.ReactNode;
  className?: string;
}

export const DonutChart = ({
  data,
  size = "md",
  showLegend = true,
  centerContent,
  className
}: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size === "sm" ? 60 : size === "md" ? 80 : 100;
  const strokeWidth = size === "sm" ? 12 : size === "md" ? 16 : 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const colorClasses = {
    brand: "stroke-brand",
    success: "stroke-success",
    warning: "stroke-warning", 
    error: "stroke-error",
    muted: "stroke-muted"
  };

  const legendColorClasses = {
    brand: "bg-brand",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error", 
    muted: "bg-muted"
  };

  let cumulativePercentage = 0;
  const svgSize = radius * 2;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <svg height={svgSize} width={svgSize} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercentage * circumference;
            
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  colorClasses[item.color || "brand"]
                )}
              />
            );
          })}
        </svg>
        
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn("w-3 h-3 rounded-full", legendColorClasses[item.color || "brand"])}
                />
                <span className="text-sm font-medium text-card-foreground">{item.label}</span>
              </div>
              <span className="text-sm text-text-muted">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};