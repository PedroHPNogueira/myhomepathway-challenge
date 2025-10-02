'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { useListMovies } from '@/services/movies/useListMovies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MovieCard } from '@/components/MovieCard';

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: moviesData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useListMovies({
    search: currentSearch,
    page: currentPage,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentSearch(searchTerm.trim());
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Movies</h1>
        <p className="text-muted-foreground">Discover your next favorite movie from our extensive database</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for movies, series, episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || isFetching || !searchTerm.trim()}
            className="h-12 px-8"
          >
            {isLoading || isFetching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {isLoading && <MovieSkeletons />}

      {isError && (
        <Alert variant="destructive" className="max-w-2xl">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {moviesData && moviesData.results.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Search Results for &quot;{currentSearch}&quot;</h2>
            <p className="text-muted-foreground">Found {moviesData.totalResults} results</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {moviesData.results.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {moviesData && moviesData.totalPages > 1 && (
            <Pagination
              handlePageChange={handlePageChange}
              isFetching={isFetching}
              page={currentPage}
              totalPages={moviesData.totalPages}
            />
          )}
        </>
      )}

      {/* No Results */}
      {moviesData && moviesData.results.length === 0 && currentSearch && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p className="text-muted-foreground mb-4">Try searching with different keywords or check your spelling</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCurrentSearch('');
            }}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!currentSearch && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start searching for movies</h3>
          <p className="text-muted-foreground">Enter a movie title, series name, or keyword to get started</p>
        </div>
      )}
    </div>
  );
}

function MovieSkeletons() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[2/3]">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Pagination({
  handlePageChange,
  isFetching,
  page,
  totalPages,
}: {
  handlePageChange: (page: number) => void;
  isFetching: boolean;
  page: number;
  totalPages: number;
}) {
  const maxVisiblePages = 5;
  const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isFetching}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNum = startPage + i;
          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              disabled={isFetching}
              className="h-8 w-8 p-0"
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isFetching}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
