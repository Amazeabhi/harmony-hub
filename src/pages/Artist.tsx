import { useParams } from 'react-router-dom';
import { useArtist, useArtistTopTracks, useArtistAlbums, useRelatedArtists } from '@/hooks/useSpotify';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, User, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/cards/TrackCard';
import AlbumCard from '@/components/cards/AlbumCard';
import ArtistCard from '@/components/cards/ArtistCard';
import Section from '@/components/common/Section';
import CardGrid from '@/components/common/CardGrid';

const Artist = () => {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading: artistLoading } = useArtist(id || '');
  const { data: topTracksData, isLoading: tracksLoading } = useArtistTopTracks(id || '');
  const { data: albumsData, isLoading: albumsLoading } = useArtistAlbums(id || '');
  const { data: relatedData } = useRelatedArtists(id || '');
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const tracks = topTracksData?.tracks || [];
  const albums = albumsData?.items || [];
  const relatedArtists = relatedData?.artists?.slice(0, 6) || [];

  const isPlayingThisArtist = tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayArtist = () => {
    if (isPlayingThisArtist) {
      togglePlay();
    } else if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (artistLoading) {
    return (
      <div className="pb-8">
        <div className="flex flex-col items-start gap-6 mb-8">
          <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-96" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  return (
    <div className="pb-8 -mx-4 lg:-mx-6 -mt-[72px] pt-[72px] px-4 lg:px-6">
      {/* Hero Section with Background */}
      <div
        className="relative -mx-4 lg:-mx-6 px-4 lg:px-6 pb-8 mb-6"
        style={{
          backgroundImage: artist.images?.[0]?.url
            ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, hsl(var(--background)) 100%), url(${artist.images[0].url})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="pt-20 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Verified className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">Verified Artist</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4">
            {artist.name}
          </h1>
          <p className="text-foreground">
            {formatFollowers(artist.followers?.total || 0)} monthly listeners
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-8">
        <Button
          onClick={handlePlayArtist}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-primary hover:bg-spotify-green-hover hover:scale-105 transition-transform play-button-shadow"
        >
          {isPlayingThisArtist && isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-1" />
          )}
        </Button>
        <Button
          variant="outline"
          className="rounded-full font-semibold border-foreground/30 hover:border-foreground"
        >
          Follow
        </Button>
      </div>

      {/* Popular Tracks */}
      <Section title="Popular">
        {tracksLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {tracks.slice(0, 5).map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} queue={tracks} />
            ))}
          </div>
        )}
      </Section>

      {/* Discography */}
      <Section title="Discography">
        {albumsLoading ? (
          <CardGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-card rounded-lg">
                <Skeleton className="aspect-square rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </CardGrid>
        ) : (
          <CardGrid>
            {albums.slice(0, 6).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </CardGrid>
        )}
      </Section>

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <Section title="Fans also like">
          <CardGrid>
            {relatedArtists.map((relatedArtist) => (
              <ArtistCard key={relatedArtist.id} artist={relatedArtist} />
            ))}
          </CardGrid>
        </Section>
      )}
    </div>
  );
};

export default Artist;
