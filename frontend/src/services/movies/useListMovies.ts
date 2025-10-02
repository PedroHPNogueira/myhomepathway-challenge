import { useQuery } from '@tanstack/react-query';

import { apiAxiosInstance } from '@/services/apiAxiosInstance';
import { OmdbMovie } from '@/types';

export interface MoviesResponse {
  results: OmdbMovie[];
  totalResults: number;
  page: number;
  totalPages: number;
}

interface UseListMoviesParams {
  search: string;
  page?: number;
}

const fetchMovies = async (search: string, page = 1): Promise<MoviesResponse> => {
  const response = await apiAxiosInstance.get('/movies', {
    params: {
      search,
      page,
    },
  });

  return response.data;
};

export const useListMovies = ({ search, page = 1 }: UseListMoviesParams) => {
  return useQuery({
    queryKey: ['movies', search, page],
    queryFn: () => fetchMovies(search, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: search.length > 0,
    retry: 2,
    retryDelay: 1000,
  });
};
