import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirectToSpotifyAuth, isAuthenticated } from '@/lib/spotify';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await redirectToSpotifyAuth();
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to connect to Spotify. Please check your configuration.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-spotify-dark-elevated to-background p-4">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <Music className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Spotify Clone</h1>
          <p className="text-muted-foreground text-lg">
            Millions of songs. Free on Spotify.
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-6 text-lg font-semibold bg-primary hover:bg-spotify-green-hover text-primary-foreground rounded-full transition-all hover:scale-105"
        >
          {isLoading ? 'Connecting...' : 'Log in with Spotify'}
        </Button>

        {/* Setup Instructions */}
        <div className="bg-card/50 rounded-lg p-6 text-left space-y-4">
          <h2 className="font-semibold text-foreground">Setup Instructions</h2>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Go to the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Spotify Developer Dashboard</a></li>
            <li>Create a new application</li>
            <li>Add <code className="bg-accent px-1 rounded">{window.location.origin}/callback</code> as a Redirect URI</li>
            <li>Copy your Client ID</li>
            <li>Create a <code className="bg-accent px-1 rounded">.env</code> file with:
              <pre className="bg-accent p-2 rounded mt-2 overflow-x-auto">
{`VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=${window.location.origin}/callback`}
              </pre>
            </li>
            <li>Restart the development server</li>
          </ol>
        </div>

        <p className="text-xs text-muted-foreground">
          This is a demo application. You need a Spotify account to use it.
        </p>
      </div>
    </div>
  );
};

export default Login;
