import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { SpotifyAlbum } from '@/hooks/useSpotify';

interface AlbumCardProps {
  album: SpotifyAlbum;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group p-4 bg-card rounded-lg hover:bg-accent/50 transition-all duration-300"
    >
      <div className="relative mb-4">
        <img
          src={album.images[0]?.url || '/placeholder.svg'}
          alt={album.name}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 play-button-shadow hover:scale-105"
          onClick={(e) => {
            e.preventDefault();
            // Play album functionality
          }}
        >
          <Play className="h-5 w-5 text-primary-foreground fill-current ml-1" />
        </button>
      </div>
      <h3 className="font-semibold text-foreground truncate mb-1">
        {album.name}
      </h3>
      <p className="text-sm text-muted-foreground truncate">
        {album.release_date.split('-')[0]} • {album.artists.map(a => a.name).join(', ')}
      </p>
    </Link>
  );
};

export default AlbumCard;
