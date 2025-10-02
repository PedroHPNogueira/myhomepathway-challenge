import { useQuery } from '@tanstack/react-query';

import { apiAxiosInstance } from '@/services/apiAxiosInstance';
import { FavoriteMovie } from '@/types';

const fetchFavoriteMovies = async (): Promise<FavoriteMovie[]> => {
  const response = await apiAxiosInstance.get('/movies/favorites');

  return response.data;
};

export const useListFavoriteMovies = () => {
  return useQuery({
    queryKey: ['favorite-movies'],
    queryFn: () => fetchFavoriteMovies(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};
