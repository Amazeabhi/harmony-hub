import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch, useCategories } from '@/hooks/useSpotify';
import Section from '@/components/common/Section';
import CardGrid from '@/components/common/CardGrid';
import TrackCard from '@/components/cards/TrackCard';
import ArtistCard from '@/components/cards/ArtistCard';
import AlbumCard from '@/components/cards/AlbumCard';
import PlaylistCard from '@/components/cards/PlaylistCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: searchResults, isLoading: searchLoading } = useSearch(debouncedQuery);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const hasResults = debouncedQuery.length > 0 && searchResults;

  return (
    <div className="pb-8">
      {/* Search Input */}
      <div className="relative max-w-md mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 py-6 bg-foreground text-background placeholder:text-muted rounded-full border-none text-base"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {hasResults ? (
        <div className="space-y-8">
          {/* Tracks */}
          {searchResults.tracks?.items?.length > 0 && (
            <Section title="Songs">
              <div className="bg-card/30 rounded-lg overflow-hidden">
                {searchResults.tracks.items.slice(0, 5).map((track: any, index: number) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    index={index}
                    queue={searchResults.tracks.items}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Artists */}
          {searchResults.artists?.items?.length > 0 && (
            <Section title="Artists">
              <CardGrid>
                {searchResults.artists.items.slice(0, 6).map((artist: any) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </CardGrid>
            </Section>
          )}

          {/* Albums */}
          {searchResults.albums?.items?.length > 0 && (
            <Section title="Albums">
              <CardGrid>
                {searchResults.albums.items.slice(0, 6).map((album: any) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </CardGrid>
            </Section>
          )}

          {/* Playlists */}
          {searchResults.playlists?.items?.length > 0 && (
            <Section title="Playlists">
              <CardGrid>
                {searchResults.playlists.items.slice(0, 6).map((playlist: any) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </CardGrid>
            </Section>
          )}
        </div>
      ) : (
        <>
          {/* Browse Categories */}
          <h2 className="text-2xl font-bold text-foreground mb-4">Browse all</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoriesData?.categories?.items?.map((category: any) => (
                <div
                  key={category.id}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 40%)`,
                  }}
                >
                  <h3 className="absolute top-4 left-4 text-xl font-bold text-foreground z-10">
                    {category.name}
                  </h3>
                  {category.icons?.[0]?.url && (
                    <img
                      src={category.icons[0].url}
                      alt={category.name}
                      className="absolute bottom-0 right-0 w-24 h-24 rotate-[25deg] translate-x-4 translate-y-4 object-cover shadow-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {searchLoading && debouncedQuery && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Searching...</div>
        </div>
      )}
    </div>
  );
};

export default Search;
