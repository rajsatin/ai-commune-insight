import { Brain, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-brand rounded-xl">
              <Brain className="w-6 h-6 text-brand-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Communication Analyzer</h1>
              <p className="text-sm text-text-muted">Advanced text analysis powered by Azure AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Help
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="font-medium">How it works</p>
                    <p className="text-xs text-text-muted">Upload documents or paste text for AI-powered communication analysis</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="font-medium">Supported formats</p>
                    <p className="text-xs text-text-muted">PDF, DOC, DOCX files up to 10MB</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="font-medium">Keyboard shortcuts</p>
                    <p className="text-xs text-text-muted">Ctrl+Enter to analyze • Ctrl+K to clear</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};