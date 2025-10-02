import { OmdbMovie } from '@/types';
import { Card, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, Calendar, Film } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { CardContent } from './ui/card';
import { CardFooter } from './ui/card';

export function MovieCard({ movie }: { movie: OmdbMovie }) {
  return (
    <Card key={movie.imdbID} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
            alt={movie.Title}
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
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {movie.Title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{movie.Year}</span>
        </div>

        <Badge variant="secondary" className="text-xs">
          <Film className="h-3 w-3 mr-1" />
          {movie.Type}
        </Badge>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
