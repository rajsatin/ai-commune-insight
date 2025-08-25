import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
  color?: "brand" | "success" | "warning" | "error" | "muted";
}

interface BarChartProps {
  data: BarData[];
  maxValue?: number;
  horizontal?: boolean;
  showValues?: boolean;
  className?: string;
}

export const BarChart = ({
  data,
  maxValue,
  horizontal = false,
  showValues = true,
  className
}: BarChartProps) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  const colorClasses = {
    brand: "bg-brand",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    muted: "bg-muted"
  };

  if (horizontal) {
    return (
      <div className={cn("space-y-4", className)}>
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-card-foreground">{item.label}</span>
                {showValues && <span className="text-text-muted">{item.value}</span>}
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    colorClasses[item.color || "brand"]
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-end justify-between gap-2", className)}>
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col items-center">
              {showValues && (
                <span className="text-sm font-medium text-card-foreground mb-2">
                  {item.value}
                </span>
              )}
              <div className="w-full bg-muted rounded-t-lg flex items-end" style={{ height: '120px' }}>
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-1000 ease-out",
                    colorClasses[item.color || "brand"]
                  )}
                  style={{ height: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-text-muted mt-2 text-center font-medium">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};