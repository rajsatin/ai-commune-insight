import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnalysisCardProps {
  title: string;
  children: ReactNode;
  status?: "success" | "warning" | "error" | "loading";
  className?: string;
}

export const AnalysisCard = ({ title, children, status, className }: AnalysisCardProps) => {
  return (
    <Card className={cn("card-medium p-6 transition-smooth", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {status && (
          <Badge 
            variant={status === "success" ? "default" : 
                    status === "warning" ? "secondary" : 
                    status === "error" ? "destructive" : "outline"}
            className={cn(
              "transition-smooth",
              status === "success" && "bg-success text-success-foreground",
              status === "warning" && "bg-warning text-warning-foreground"
            )}
          >
            {status === "loading" ? "Analyzing..." : status}
          </Badge>
        )}
      </div>
      {children}
    </Card>
  );
};