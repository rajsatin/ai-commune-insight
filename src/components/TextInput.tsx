import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isAnalyzing?: boolean;
  disabled?: boolean;
}

export const TextInput = ({ onAnalyze, onClear, isAnalyzing = false, disabled = false }: TextInputProps) => {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 10000;

  const sampleTexts = [
    "I think maybe we could possibly consider looking into this issue when we have some time, if that's okay with everyone.",
    "We need to address the budget shortfall immediately. I recommend cutting discretionary spending by 15% and reallocating resources to high-priority projects.",
    "Thank you for bringing this to my attention. I appreciate your patience as we work together to find the best solution for everyone involved."
  ];

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && text.trim() && !isAnalyzing) {
        e.preventDefault();
        handleAnalyze();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [text, isAnalyzing]);

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const handleClear = () => {
    setText("");
    setCharCount(0);
    onClear();
    textareaRef.current?.focus();
  };

  const handleSampleSelect = (sample: string) => {
    setText(sample);
    setCharCount(sample.length);
    textareaRef.current?.focus();
  };

  const isOverLimit = charCount > maxLength;
  const canAnalyze = text.trim().length > 0 && !isOverLimit && !isAnalyzing && !disabled;

  return (
    <div className="space-y-6">
      <Card className="card-medium p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-semibold text-card-foreground">Paste Your Text</h3>
          </div>
          
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="Paste your text here for analysis. This could be an email, document, message, or any written communication you'd like to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled}
              className={cn(
                "min-h-[200px] resize-y transition-smooth",
                "focus:ring-2 focus:ring-brand focus:border-transparent",
                isOverLimit && "border-error focus:ring-error"
              )}
              aria-describedby="char-count"
            />
            <div 
              id="char-count"
              className={cn(
                "flex justify-between text-sm",
                isOverLimit ? "text-error" : "text-text-muted"
              )}
            >
              <span>
                {isOverLimit ? "Text is too long" : "Enter text to analyze communication patterns"}
              </span>
              <span>
                {charCount.toLocaleString()} / {maxLength.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="bg-brand hover:bg-brand/90 text-brand-foreground gap-2 transition-bounce"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze Text"}
            </Button>
            
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={disabled || isAnalyzing}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {!text && !disabled && (
        <Card className="card-soft p-6">
          <div className="space-y-4">
            <h4 className="font-medium text-card-foreground">Try these examples:</h4>
            <div className="grid gap-3">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleSelect(sample)}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-smooth",
                    "hover:border-brand hover:bg-brand-muted/10",
                    "focus:outline-none focus:ring-2 focus:ring-brand"
                  )}
                >
                  <p className="text-sm text-card-foreground line-clamp-2">
                    "{sample}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};