import { useFeaturedPlaylists, useNewReleases, useTopArtists, useRecentlyPlayed } from '@/hooks/useSpotify';
import Section from '@/components/common/Section';
import CardGrid from '@/components/common/CardGrid';
import PlaylistCard from '@/components/cards/PlaylistCard';
import AlbumCard from '@/components/cards/AlbumCard';
import ArtistCard from '@/components/cards/ArtistCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';

const Home = () => {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedPlaylists();
  const { data: newReleasesData, isLoading: releasesLoading } = useNewReleases();
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists();
  const { data: recentData, isLoading: recentLoading } = useRecentlyPlayed();
  const { playTrack } = usePlayer();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get unique recent tracks
  const recentTracks = recentData?.items
    ?.reduce((acc: any[], item: any) => {
      if (!acc.find((t) => t.id === item.track.id)) {
        acc.push(item.track);
      }
      return acc;
    }, [])
    .slice(0, 6);

  return (
    <div className="pb-8">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-foreground mb-6">{greeting()}</h1>

      {/* Quick Access Grid */}
      {recentTracks && recentTracks.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
          {recentTracks.map((track: any) => (
            <div
              key={track.id}
              className="group flex items-center bg-card/50 hover:bg-card rounded overflow-hidden transition-colors cursor-pointer"
              onClick={() => playTrack(track, recentTracks)}
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-12 h-12 md:w-16 md:h-16 object-cover"
              />
              <span className="flex-1 px-3 font-semibold text-sm truncate">
                {track.name}
              </span>
              <button className="hidden group-hover:flex items-center justify-center w-10 h-10 bg-primary rounded-full mr-3 play-button-shadow hover:scale-105 transition-transform">
                <Play className="h-4 w-4 text-primary-foreground fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Featured Playlists */}
      <Section title="Featured Playlists">
        {featuredLoading ? (
          <CardGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-card rounded-lg">
                <Skeleton className="aspect-square rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </CardGrid>
        ) : (
          <CardGrid>
            {featuredData?.playlists?.items?.slice(0, 6).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </CardGrid>
        )}
      </Section>

      {/* New Releases */}
      <Section title="New Releases">
        {releasesLoading ? (
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
            {newReleasesData?.albums?.items?.slice(0, 6).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </CardGrid>
        )}
      </Section>

      {/* Your Top Artists */}
      {topArtistsData?.items && topArtistsData.items.length > 0 && (
        <Section title="Your Top Artists">
          {artistsLoading ? (
            <CardGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-card rounded-lg">
                  <Skeleton className="aspect-square rounded-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
              ))}
            </CardGrid>
          ) : (
            <CardGrid>
              {topArtistsData.items.slice(0, 6).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </CardGrid>
          )}
        </Section>
      )}
    </div>
  );
};

export default Home;
