import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAxiosInstance } from '@/services/apiAxiosInstance';

const removeFavoriteMovie = async (movieId: string): Promise<void> => {
  await apiAxiosInstance.delete(`/movies/favorites/${movieId}`);
};

export const useRemoveFavoriteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavoriteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-movies'] });
    },
  });
};
