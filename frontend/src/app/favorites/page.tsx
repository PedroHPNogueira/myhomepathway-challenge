'use client';

import { Heart, Search } from 'lucide-react';
import { useListFavoriteMovies } from '@/services/favoriteMovies/useListFavoriteMovies';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import { MovieSkeletons } from '@/components/MovieSkeletons';

export default function FavoritesPage() {
  const { data: favorites, isLoading, isError, error } = useListFavoriteMovies();
  const isMobile = useIsMobile();

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="mb-6">
        <Heart className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No favorite movies yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your collection by adding movies to your favorites. Discover amazing films and keep track of
          the ones you love!
        </p>
      </div>

      <div className={`flex gap-3 justify-center ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <Button asChild size={isMobile ? 'default' : 'lg'} className="w-full sm:w-auto">
          <Link href="/movies">
            <Search className="h-4 w-4 mr-2" />
            Browse Movies
          </Link>
        </Button>
      </div>
    </div>
  );

  const renderFavoritesList = () => {
    if (!favorites || favorites.length === 0) {
      return renderEmptyState();
    }

    return (
      <>
        <div className="mb-8">
          <div className={`flex items-center mb-4 ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
            <div className={isMobile ? 'text-center' : ''}>
              <h2 className="text-2xl font-semibold mb-2">Your Favorite Movies</h2>
              <p className="text-muted-foreground">
                You have {favorites.length} movie{favorites.length !== 1 ? 's' : ''} in your favorites
              </p>
            </div>

            <Button variant="outline" asChild className={isMobile ? 'w-full' : ''}>
              <Link href="/movies">
                <Search className="h-4 w-4 mr-2" />
                Add More
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isFavorite={true} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold">Favorite Movies</h1>
        </div>
        <p className="text-muted-foreground">Your personal collection of favorite movies</p>
      </div>

      {/* Loading State */}
      {isLoading && <MovieSkeletons />}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="max-w-2xl">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load your favorite movies. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !isError && renderFavoritesList()}
    </div>
  );
}
