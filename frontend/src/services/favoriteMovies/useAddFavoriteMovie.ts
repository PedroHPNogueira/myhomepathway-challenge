import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAxiosInstance } from '@/services/apiAxiosInstance';
import { FavoriteMovie } from '@/types';

interface AddFavoriteMovieDTO {
  imdbId: string;
  title: string;
  year: string;
  poster: string;
}

const addFavoriteMovie = async (movie: AddFavoriteMovieDTO): Promise<FavoriteMovie> => {
  const response = await apiAxiosInstance.post('/movies/favorites', movie);

  return response.data;
};

export const useAddFavoriteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavoriteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-movies'] });
    },
  });
};
