import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { useToast } from "@/hooks/use-toast";
import AzureService, { AnalysisResult } from "@/services/azureService";

const Index = () => {
  const [activeTab, setActiveTab] = useState("paste");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "No text to analyze",
        description: "Please provide some text to analyze."
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      toast({
        title: "Analyzing communication...",
        description: "AI is processing your text for insights"
      });

      const result = await AzureService.analyzeText(text);
      setAnalysis(result);
      
      toast({
        title: "Analysis complete!",
        description: "Your communication analysis is ready"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive", 
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during analysis"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setAnalysis(null);
    toast({
      title: "Cleared",
      description: "Analysis results have been cleared"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              AI-Powered Communication Analysis
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Upload documents or paste text to get detailed insights on tone, clarity, confidence, and communication effectiveness powered by Azure AI.
            </p>
          </div>

          {/* Input Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="paste" className="gap-2">
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                Upload File
              </TabsTrigger>
            </TabsList>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Input Rail */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <TabsContent value="paste" className="mt-0">
                    <TextInput
                      onAnalyze={handleAnalyze}
                      onClear={handleClear}
                      isAnalyzing={isAnalyzing}
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload" className="mt-0">
                    <FileUpload
                      onAnalyze={handleAnalyze}
                      onClear={handleClear}
                      isAnalyzing={isAnalyzing}
                    />
                  </TabsContent>
                </div>
              </div>

              {/* Analysis Dashboard */}
              <div className="lg:col-span-7 xl:col-span-8">
                <AnalysisDashboard 
                  analysis={analysis} 
                  isLoading={isAnalyzing} 
                />
              </div>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-subtle/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <div>
              <p>&copy; 2024 ABB CommAnalyzer. Powered by AI.</p>
            </div>
            <div className="flex items-center gap-6">
              <span>Keyboard shortcuts: Ctrl+Enter to analyze • Ctrl+K to clear</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;