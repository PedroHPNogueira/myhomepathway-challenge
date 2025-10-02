import { FavoriteMovie, OmdbMovie } from '@/types';
import { Card, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, Calendar } from 'lucide-react';
import Image from 'next/image';
import { CardContent } from './ui/card';
import { useAddFavoriteMovie } from '@/services/favoriteMovies/useAddFavoriteMovie';
import { useMemo, useCallback } from 'react';
import { useRemoveFavoriteMovie } from '@/services/favoriteMovies/useRemoveFavoriteMovie';

export function MovieCard({ movie, isFavorite }: { movie: OmdbMovie | FavoriteMovie; isFavorite: boolean }) {
  const { mutate: addFavoriteMovie } = useAddFavoriteMovie();
  const { mutate: removeFavoriteMovie } = useRemoveFavoriteMovie();

  const movieInfo = useMemo(
    () => ({
      imdbID: 'imdbId' in movie ? movie.imdbId : movie.imdbID,
      title: 'Title' in movie ? movie.Title : movie.title,
      year: 'Year' in movie ? movie.Year : movie.year,
      poster: 'Poster' in movie ? movie.Poster : movie.poster,
    }),
    [movie],
  );

  const handleAddFavoriteMovie = useCallback(() => {
    addFavoriteMovie({
      imdbId: movieInfo.imdbID,
      title: movieInfo.title,
      year: movieInfo.year,
      poster: movieInfo.poster,
    });
  }, [addFavoriteMovie, movieInfo]);

  const handleRemoveFavoriteMovie = () => {
    const movieId = 'id' in movie ? movie.id : null;
    if (!movieId) return;
    removeFavoriteMovie(movieId);
  };

  return (
    <Card key={movieInfo.imdbID} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movieInfo.poster !== 'N/A' ? movieInfo.poster : '/placeholder-movie.jpg'}
            alt={movieInfo.title}
            width={300}
            height={800}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={isFavorite ? handleRemoveFavoriteMovie : handleAddFavoriteMovie}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {movieInfo.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{movieInfo.year}</span>
        </div>
      </CardContent>
    </Card>
  );
}
