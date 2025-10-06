import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisFormProps {
  gscAccessToken?: string;
  onAnalysisComplete: () => void;
}

export const AnalysisForm = ({ gscAccessToken, onAnalysisComplete }: AnalysisFormProps) => {
  const [siteUrl, setSiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!siteUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-seo', {
        body: { siteUrl, gscAccessToken },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: `Analyzed ${data.pagesAnalyzed} pages and found ${data.opportunitiesFound} opportunities`,
      });

      onAnalysisComplete();
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze site",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Website URL</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the full URL of your website to analyze internal linking opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
