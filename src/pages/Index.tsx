import { useState, useEffect } from "react";
import { GoogleOAuth } from "@/components/GoogleOAuth";
import { AnalysisForm } from "@/components/AnalysisForm";
import { TokenizationView } from "@/components/TokenizationView";
import { OpportunitiesTable } from "@/components/OpportunitiesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Hash, BarChart } from "lucide-react";

const Index = () => {
  const [gscAccessToken, setGscAccessToken] = useState<string | undefined>();
  const [analysisKey, setAnalysisKey] = useState(0);

  useEffect(() => {
    // Check for OAuth callback
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setGscAccessToken(accessToken);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">SEO Link Analyzer</h1>
              <p className="text-muted-foreground">Advanced internal linking opportunities with BM25 scoring</p>
            </div>
          </div>
        </header>

        {/* OAuth Section */}
        {!gscAccessToken && (
          <div className="mb-8">
            <GoogleOAuth onAuthSuccess={setGscAccessToken} />
          </div>
        )}

        {/* Analysis Form */}
        <div className="mb-8">
          <AnalysisForm 
            gscAccessToken={gscAccessToken} 
            onAnalysisComplete={() => setAnalysisKey(prev => prev + 1)}
          />
        </div>

        {/* Results Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="tokenization" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tokenization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" key={`opp-${analysisKey}`}>
            <OpportunitiesTable />
          </TabsContent>

          <TabsContent value="tokenization" key={`token-${analysisKey}`}>
            <TokenizationView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
