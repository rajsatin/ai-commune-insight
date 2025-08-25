import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDropzone } from "./FileDropzone";
import { Sparkles, Trash2, Upload, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AzureService from "@/services/azureService";

interface FileUploadProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isAnalyzing?: boolean;
  disabled?: boolean;
}

export const FileUpload = ({ onAnalyze, onClear, isAnalyzing = false, disabled = false }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadComplete(false);
    setExtractedText("");
    
    try {
      setIsUploading(true);
      
      // Step 1: Get SAS URL
      toast({
        title: "Uploading file...",
        description: "Generating secure upload URL"
      });
      
      const { uploadUrl, readUrl } = await AzureService.getSASUrl(file.name);
      
      // Step 2: Upload file to Azure Blob
      toast({
        title: "Uploading file...",
        description: "Transferring file to Azure storage"
      });
      
      await AzureService.uploadFile(file, uploadUrl);
      
      // Step 3: Extract text using Azure Document Intelligence
      toast({
        title: "Processing document...",
        description: "Extracting text content"
      });
      
      const text = await AzureService.extractDocument(readUrl);
      
      if (!text || text.trim().length === 0) {
        throw new Error("No text content could be extracted from the document");
      }
      
      setExtractedText(text);
      setUploadComplete(true);
      
      toast({
        title: "Upload successful!",
        description: `Extracted ${text.length} characters from ${file.name}`
      });
      
    } catch (error) {
      console.error("Upload/extraction error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = () => {
    if (extractedText.trim()) {
      onAnalyze(extractedText.trim());
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadComplete(false);
    setExtractedText("");
    onClear();
  };

  const canAnalyze = uploadComplete && extractedText.trim().length > 0 && !isAnalyzing && !disabled;

  return (
    <div className="space-y-6">
      <Card className="card-medium p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-semibold text-card-foreground">Upload Document</h3>
          </div>
          
          {!selectedFile ? (
            <FileDropzone
              onFileSelect={handleFileSelect}
              disabled={disabled || isUploading}
            />
          ) : (
            <div className="space-y-4">
              {/* File info */}
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-smooth",
                uploadComplete ? "border-success bg-success-muted/10" : "border-border"
              )}>
                <div className={cn(
                  "p-2 rounded-lg",
                  uploadComplete ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {uploadComplete ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">{selectedFile.name}</p>
                  <p className="text-sm text-text-muted">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    {uploadComplete && ` • ${extractedText.length} characters extracted`}
                  </p>
                </div>
                {isUploading && (
                  <div className="animate-spin w-5 h-5 border-2 border-brand border-t-transparent rounded-full" />
                )}
              </div>

              {/* Extracted text preview */}
              {extractedText && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Extracted Content Preview:</label>
                  <div className="max-h-32 overflow-y-auto p-3 bg-surface-subtle rounded-lg border text-sm text-card-foreground">
                    {extractedText.substring(0, 500)}{extractedText.length > 500 ? "..." : ""}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="bg-brand hover:bg-brand/90 text-brand-foreground gap-2 transition-bounce"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Document"}
                </Button>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                  disabled={disabled || isAnalyzing || isUploading}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      {!selectedFile && (
        <Card className="card-soft p-6">
          <div className="space-y-4">
            <h4 className="font-medium text-card-foreground">How it works:</h4>
            <div className="grid gap-3 text-sm text-text-muted">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-xs font-medium">1</div>
                <div>Upload your PDF, DOC, or DOCX file (up to 10MB)</div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-xs font-medium">2</div>
                <div>Azure Document Intelligence extracts the text content</div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-xs font-medium">3</div>
                <div>AI analyzes communication patterns and provides insights</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};