export interface PaginatedResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export interface OmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbMovie[];
  totalResults: string;
  Response: string;
}

export interface OmdbErrorResponse {
  Error: string;
  Response: string;
}
