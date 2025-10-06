import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth providers typically redirect back with hash or query params
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash || search) {
      // Redirect back to main page with the hash/search intact
      navigate(`/${hash}${search}`);
    } else {
      // No auth data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
