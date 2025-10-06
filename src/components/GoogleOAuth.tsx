import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";

interface GoogleOAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

export const GoogleOAuth = ({ onAuthSuccess }: GoogleOAuthProps) => {
  const [clientId, setClientId] = useState("");

  const handleGoogleLogin = () => {
    if (!clientId) {
      alert("Please enter your Google Client ID");
      return;
    }

    const redirectUri = `${window.location.origin}/oauth-callback`;
    const scope = 'https://www.googleapis.com/auth/webmasters.readonly';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
          <Chrome className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Connect Google Search Console</h2>
          <p className="text-muted-foreground mb-4">
            Authorize access to analyze your site's search performance data
          </p>
        </div>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Google OAuth Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Get your Client ID from Google Cloud Console
          </p>
        </div>
        <Button onClick={handleGoogleLogin} size="lg" className="w-full">
          <Chrome className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>
      </div>
    </Card>
  );
};

