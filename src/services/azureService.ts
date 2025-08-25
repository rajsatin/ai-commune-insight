// Azure AI Communication Analyzer Service
export interface AnalysisResult {
  overall_score: number;
  tone_emotion: {
    formal: number;
    informal: number;
    positive: number;
    negative: number;
    neutral: number;
    empathetic: number;
  };
  clarity_readability: {
    score: number;
    reading_level: string;
    notes: string[];
  };
  confidence: {
    score: number;
    hedging_phrases: string[];
    decisive_phrases: string[];
  };
  sensitivity: {
    risk_score: number;
    flags: Array<{ text: string; reason: string; severity: "low" | "medium" | "high" }>;
  };
  ambiguity_precision: {
    ambiguity_score: number;
    ambiguous_phrases: Array<{ phrase: string; suggestion: string }>;
  };
  satisfaction_politeness: {
    score: number;
    drivers: string[];
  };
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export class AzureService {
  private static readonly AZURE_OPENAI_BASE = "https://peela-mekz7k6n-eastus2.cognitiveservices.azure.com";
  private static readonly AZURE_KEY = "CTAJJleij1q57OVWtjwuFNpND0wQdL7pif1b2LFYl6YZNkvxBiG8JQQJ99BHACHYHv6XJ3w3AAAAACOGpilp";
  private static readonly DEPLOYMENT_NAME = "abb-azureai-gpt-5-mini";
  private static readonly API_VERSION = "2024-02-15-preview";
  private static readonly SAS_ENDPOINT = "https://abbllmpoc-dj0722hax-sa-technologies.vercel.app/api/getAzureSAS";
  private static readonly EXTRACT_ENDPOINT = "https://abbllmpoc-e0luaft4x-sa-technologies.vercel.app/api/extractDocument";

  static async getSASUrl(fileName: string): Promise<{ uploadUrl: string; readUrl: string }> {
    console.log("Requesting SAS URL for file:", fileName);
    console.log("SAS Endpoint:", this.SAS_ENDPOINT);
    
    try {
      const response = await fetch(this.SAS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SAS URL Error:", response.status, response.statusText, errorText);
        throw new Error(`SAS URL generation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("SAS URL response:", data);
      return {
        uploadUrl: data.uploadUrl,
        readUrl: data.readUrl,
      };
    } catch (error) {
      console.error("SAS URL fetch error:", error);
      throw new Error(`Failed to get SAS URL: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async uploadFile(file: File, uploadUrl: string): Promise<void> {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async extractDocument(readUrl: string): Promise<string> {
    try {
      const response = await fetch(this.EXTRACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readUrl }),
      });

      if (!response.ok) {
        throw new Error(`Document extraction failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.extractedText || data.content || "";
    } catch (error) {
      throw new Error(`Failed to extract document: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async analyzeText(text: string): Promise<AnalysisResult> {
    const prompt = `Analyze the following text for communication effectiveness and return ONLY a JSON object with the exact structure below. All scores should be normalized to 0-100 scale:

{
  "overall_score": <number 0-100>,
  "tone_emotion": {
    "formal": <number 0-100>,
    "informal": <number 0-100>,
    "positive": <number 0-100>,
    "negative": <number 0-100>,
    "neutral": <number 0-100>,
    "empathetic": <number 0-100>
  },
  "clarity_readability": {
    "score": <number 0-100>,
    "reading_level": "<string like 'College Level', 'High School', etc>",
    "notes": ["<array of string insights>"]
  },
  "confidence": {
    "score": <number 0-100>,
    "hedging_phrases": ["<array of hedging phrases found>"],
    "decisive_phrases": ["<array of decisive phrases found>"]
  },
  "sensitivity": {
    "risk_score": <number 0-100>,
    "flags": [{"text": "<flagged phrase>", "reason": "<why flagged>", "severity": "low|medium|high"}]
  },
  "ambiguity_precision": {
    "ambiguity_score": <number 0-100 where higher is more ambiguous>,
    "ambiguous_phrases": [{"phrase": "<ambiguous text>", "suggestion": "<clearer alternative>"}]
  },
  "satisfaction_politeness": {
    "score": <number 0-100>,
    "drivers": ["<array of politeness indicators>"]
  },
  "sentiment_distribution": {
    "positive": <number 0-100>,
    "neutral": <number 0-100>,
    "negative": <number 0-100>
  }
}

Text to analyze:
${text}`;

    const endpoint = `${this.AZURE_OPENAI_BASE}/openai/deployments/${this.DEPLOYMENT_NAME}/chat/completions?api-version=${this.API_VERSION}`;
    
    console.log("Making request to Azure OpenAI:", endpoint);
    console.log("Using deployment:", this.DEPLOYMENT_NAME);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.AZURE_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Azure OpenAI Error:", response.status, response.statusText, errorText);
        throw new Error(`Azure OpenAI API failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content received from Azure OpenAI");
      }

      // Clean the response to extract JSON
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      
      const analysis = JSON.parse(jsonStr.trim());
      return analysis as AnalysisResult;
    } catch (error) {
      throw new Error(`Failed to analyze text: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export default AzureService;