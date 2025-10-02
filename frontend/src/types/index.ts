export interface OmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface FavoriteMovie {
  id: string;
  imdbId: string;
  title: string;
  year: string;
  poster: string;
  createdAt: string;
  updatedAt: string;
}
