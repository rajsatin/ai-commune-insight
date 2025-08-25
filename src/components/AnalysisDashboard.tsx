import { AnalysisCard } from "./AnalysisCard";
import { RadialGauge } from "./RadialGauge";
import { ProgressBar } from "./ProgressBar";
import { BarChart } from "./BarChart";
import { DonutChart } from "./DonutChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle, Lightbulb, Copy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { AnalysisResult } from "@/services/azureService";

interface AnalysisDashboardProps {
  analysis: AnalysisResult | null;
  isLoading?: boolean;
}

export const AnalysisDashboard = ({ analysis, isLoading = false }: AnalysisDashboardProps) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  if (!analysis && !isLoading) {
    return (
      <Card className="card-soft p-12 text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="p-4 bg-brand/10 text-brand rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">Ready to Analyze</h3>
          <p className="text-text-muted">
            Upload a document or paste text to get started with AI-powered communication analysis.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="card-medium p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!analysis) return null;

  const toneData = [
    { label: "Formal", value: analysis.tone_emotion.formal, color: "brand" as const },
    { label: "Informal", value: analysis.tone_emotion.informal, color: "success" as const },
    { label: "Positive", value: analysis.tone_emotion.positive, color: "success" as const },
    { label: "Negative", value: analysis.tone_emotion.negative, color: "error" as const },
    { label: "Neutral", value: analysis.tone_emotion.neutral, color: "muted" as const },
    { label: "Empathetic", value: analysis.tone_emotion.empathetic, color: "brand" as const }
  ];

  const sentimentData = [
    { label: "Positive", value: analysis.sentiment_distribution.positive, color: "success" as const },
    { label: "Neutral", value: analysis.sentiment_distribution.neutral, color: "muted" as const },
    { label: "Negative", value: analysis.sentiment_distribution.negative, color: "error" as const }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {/* Overall Score */}
      <AnalysisCard title="Overall Communication Score" className="lg:col-span-2 xl:col-span-1">
        <div className="flex flex-col items-center">
          <RadialGauge
            value={analysis.overall_score}
            size="lg"
            label="Communication Effectiveness"
            color={analysis.overall_score >= 80 ? "success" : analysis.overall_score >= 60 ? "warning" : "error"}
          />
          <p className="text-sm text-text-muted text-center mt-4 max-w-xs">
            Based on analysis of tone, clarity, confidence, and overall communication effectiveness
          </p>
        </div>
      </AnalysisCard>

      {/* Tone & Emotion */}
      <AnalysisCard title="Tone & Emotion Analysis" className="xl:col-span-2">
        <div className="space-y-4">
          <BarChart data={toneData} horizontal showValues />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                <ChevronDown className="w-4 h-4" />
                View details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="text-sm text-text-muted space-y-1">
                <p>• <strong>Formal tone:</strong> Professional and structured communication</p>
                <p>• <strong>Positive sentiment:</strong> Optimistic and encouraging language</p>
                <p>• <strong>Empathetic elements:</strong> Shows understanding and consideration</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </AnalysisCard>

      {/* Clarity & Readability */}
      <AnalysisCard title="Clarity & Readability">
        <div className="space-y-4">
          <ProgressBar
            value={analysis.clarity_readability.score}
            label="Clarity Score"
            color={analysis.clarity_readability.score >= 80 ? "success" : analysis.clarity_readability.score >= 60 ? "warning" : "error"}
          />
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{analysis.clarity_readability.reading_level}</Badge>
            <span className="text-sm text-text-muted">Reading Level</span>
          </div>
          {analysis.clarity_readability.notes.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  View insights ({analysis.clarity_readability.notes.length})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="space-y-1">
                  {analysis.clarity_readability.notes.map((note, i) => (
                    <p key={i} className="text-sm text-text-muted">• {note}</p>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AnalysisCard>

      {/* Confidence Level */}
      <AnalysisCard title="Confidence Level">
        <div className="space-y-4">
          <RadialGauge
            value={analysis.confidence.score}
            size="md"
            color={analysis.confidence.score >= 80 ? "success" : analysis.confidence.score >= 60 ? "warning" : "error"}
          />
          <div className="space-y-2">
            {analysis.confidence.hedging_phrases.length > 0 && (
              <div>
                <p className="text-sm font-medium text-card-foreground mb-1">Hedging phrases:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.confidence.hedging_phrases.slice(0, 3).map((phrase, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {phrase}
                    </Badge>
                  ))}
                  {analysis.confidence.hedging_phrases.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{analysis.confidence.hedging_phrases.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {analysis.confidence.decisive_phrases.length > 0 && (
              <div>
                <p className="text-sm font-medium text-card-foreground mb-1">Decisive phrases:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.confidence.decisive_phrases.slice(0, 3).map((phrase, i) => (
                    <Badge key={i} variant="default" className="text-xs bg-success text-success-foreground">
                      {phrase}
                    </Badge>
                  ))}
                  {analysis.confidence.decisive_phrases.length > 3 && (
                    <Badge variant="default" className="text-xs bg-success text-success-foreground">
                      +{analysis.confidence.decisive_phrases.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </AnalysisCard>

      {/* Sensitivity Analysis */}
      <AnalysisCard title="Sensitivity Analysis">
        <div className="space-y-4">
          <RadialGauge
            value={analysis.sensitivity.risk_score}
            size="md"
            label="Risk Level"
            color={analysis.sensitivity.risk_score <= 30 ? "success" : analysis.sensitivity.risk_score <= 60 ? "warning" : "error"}
          />
          {analysis.sensitivity.flags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-card-foreground">
                Flagged content ({analysis.sensitivity.flags.length}):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {analysis.sensitivity.flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-surface-subtle">
                    <AlertTriangle className={cn(
                      "w-4 h-4 mt-0.5 flex-shrink-0",
                      flag.severity === "high" ? "text-error" :
                      flag.severity === "medium" ? "text-warning" : "text-success"
                    )} />
                    <div className="text-xs space-y-1">
                      <p className="font-medium">"{flag.text}"</p>
                      <p className="text-text-muted">{flag.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnalysisCard>

      {/* Ambiguity & Precision */}
      <AnalysisCard title="Ambiguity & Precision">
        <div className="space-y-4">
          <ProgressBar
            value={100 - analysis.ambiguity_precision.ambiguity_score}
            label="Precision Score"
            color={analysis.ambiguity_precision.ambiguity_score <= 30 ? "success" : analysis.ambiguity_precision.ambiguity_score <= 60 ? "warning" : "error"}
          />
          {analysis.ambiguity_precision.ambiguous_phrases.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  View suggestions ({analysis.ambiguity_precision.ambiguous_phrases.length})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analysis.ambiguity_precision.ambiguous_phrases.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface-subtle text-sm">
                      <p><strong>Replace:</strong> "{item.phrase}"</p>
                      <p><strong>With:</strong> "{item.suggestion}"</p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AnalysisCard>

      {/* Politeness */}
      <AnalysisCard title="Satisfaction & Politeness">
        <div className="space-y-4">
          <RadialGauge
            value={analysis.satisfaction_politeness.score}
            size="md"
            color={analysis.satisfaction_politeness.score >= 80 ? "success" : analysis.satisfaction_politeness.score >= 60 ? "warning" : "error"}
          />
          {analysis.satisfaction_politeness.drivers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">Politeness indicators:</p>
              <div className="flex flex-wrap gap-1">
                {analysis.satisfaction_politeness.drivers.slice(0, 4).map((driver, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {driver}
                  </Badge>
                ))}
                {analysis.satisfaction_politeness.drivers.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{analysis.satisfaction_politeness.drivers.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </AnalysisCard>

      {/* Sentiment Distribution */}
      <AnalysisCard title="Sentiment Distribution">
        <DonutChart
          data={sentimentData}
          size="md"
          centerContent={
            <div className="text-center">
              <div className="text-lg font-bold text-card-foreground">
                {Math.max(
                  analysis.sentiment_distribution.positive,
                  analysis.sentiment_distribution.neutral,
                  analysis.sentiment_distribution.negative
                ).toFixed(0)}%
              </div>
              <div className="text-xs text-text-muted">Dominant</div>
            </div>
          }
        />
      </AnalysisCard>
    </div>
  );
};