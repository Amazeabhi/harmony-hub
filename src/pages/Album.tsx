import { useParams, Link } from 'react-router-dom';
import { useAlbum } from '@/hooks/useSpotify';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, Clock, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/cards/TrackCard';
import { useMemo } from 'react';

const Album = () => {
  const { id } = useParams<{ id: string }>();
  const { data: album, isLoading } = useAlbum(id || '');
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const tracks = useMemo(() => {
    return album?.tracks?.items?.map((track: any) => ({
      ...track,
      album: {
        id: album?.id,
        name: album?.name,
        images: album?.images,
      },
    })) || [];
  }, [album]);

  const isPlayingThisAlbum = tracks.some((t: any) => t.id === currentTrack?.id);

  const handlePlayAlbum = () => {
    if (isPlayingThisAlbum) {
      togglePlay();
    } else if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const totalDuration = useMemo(() => {
    const ms = tracks.reduce((acc: number, track: any) => acc + (track?.duration_ms || 0), 0);
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins} min ${secs} sec`;
  }, [tracks]);

  if (isLoading) {
    return (
      <div className="pb-8">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Disc className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Album not found</p>
      </div>
    );
  }

  const releaseYear = album.release_date?.split('-')[0];
  const albumType = album.album_type?.charAt(0).toUpperCase() + album.album_type?.slice(1);

  return (
    <div className="pb-8 -mx-4 lg:-mx-6 -mt-[72px] pt-[72px] px-4 lg:px-6 bg-gradient-to-b from-orange-900/50 to-transparent">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-6">
        <img
          src={album.images?.[0]?.url || '/placeholder.svg'}
          alt={album.name}
          className="w-48 h-48 md:w-56 md:h-56 rounded shadow-2xl object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-2">{albumType}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 line-clamp-2">
            {album.name}
          </h1>
          <div className="flex flex-wrap items-center gap-1 text-sm text-foreground">
            {album.artists?.map((artist: any, index: number) => (
              <span key={artist.id}>
                {index > 0 && <span className="text-muted-foreground">, </span>}
                <Link
                  to={`/artist/${artist.id}`}
                  className="font-semibold hover:underline"
                >
                  {artist.name}
                </Link>
              </span>
            ))}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{releaseYear}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{album.total_tracks} songs,</span>
            <span className="text-muted-foreground">{totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-6">
        <Button
          onClick={handlePlayAlbum}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-primary hover:bg-spotify-green-hover hover:scale-105 transition-transform play-button-shadow"
        >
          {isPlayingThisAlbum && isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-1" />
          )}
        </Button>
      </div>

      {/* Track List Header */}
      <div className="grid grid-cols-[16px_4fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-border text-sm text-muted-foreground mb-2">
        <span>#</span>
        <span>Title</span>
        <span className="flex justify-end">
          <Clock className="h-4 w-4" />
        </span>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {tracks.map((track: any, index: number) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            queue={tracks}
            showAlbum={false}
          />
        ))}
      </div>

      {/* Copyright */}
      <div className="mt-8 text-xs text-muted-foreground space-y-1">
        {album.copyrights?.map((copyright: any, index: number) => (
          <p key={index}>{copyright.text}</p>
        ))}
      </div>
    </div>
  );
};

export default Album;
