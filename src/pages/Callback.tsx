import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getAccessToken } from '@/lib/spotify';
import { toast } from 'sonner';

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('auth_state');
      const urlError = searchParams.get('error');

      if (urlError) {
        setError(`Authorization failed: ${urlError}`);
        return;
      }

      if (!code || state !== storedState) {
        setError('Invalid authorization response');
        return;
      }

      try {
        const token = await getAccessToken(code);
        if (token) {
          toast.success('Successfully logged in!');
          navigate('/');
        } else {
          setError('Failed to get access token');
        }
      } catch (err) {
        setError('Failed to authenticate with Spotify');
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Logging you in...</p>
    </div>
  );
};

export default Callback;
