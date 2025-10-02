/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { OmdbService } from '@/omdb/omdb.service';
import { OmdbSearchResponse } from '@/types';

import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let omdbService: jest.Mocked<OmdbService>;

  beforeEach(async () => {
    const mockOmdbService = {
      searchMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: OmdbService,
          useValue: mockOmdbService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    omdbService = module.get(OmdbService);
  });

  describe('listMovies', () => {
    it('should return paginated movie results', async () => {
      const mockOmdbResponse: OmdbSearchResponse = {
        Search: [
          {
            Title: 'Batman',
            Year: '1989',
            imdbID: 'tt0096895',
            Type: 'movie',
            Poster: 'https://example.com/poster1.jpg',
          },
          {
            Title: 'Batman Returns',
            Year: '1992',
            imdbID: 'tt0103776',
            Type: 'movie',
            Poster: 'https://example.com/poster2.jpg',
          },
        ],
        totalResults: '25',
        Response: 'True',
      };

      omdbService.searchMovies.mockResolvedValue(mockOmdbResponse);

      const result = await service.listMovies('batman', 1);

      expect(result).toEqual({
        results: mockOmdbResponse.Search,
        totalResults: 25,
        page: 1,
        totalPages: 3, // Math.ceil(25 / 10)
      });

      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 1);
    });

    it('should handle single page results', async () => {
      const mockOmdbResponse: OmdbSearchResponse = {
        Search: [
          {
            Title: 'The Dark Knight',
            Year: '2008',
            imdbID: 'tt0468569',
            Type: 'movie',
            Poster: 'https://example.com/poster.jpg',
          },
        ],
        totalResults: '1',
        Response: 'True',
      };

      omdbService.searchMovies.mockResolvedValue(mockOmdbResponse);

      const result = await service.listMovies('dark knight', 1);

      expect(result).toEqual({
        results: mockOmdbResponse.Search,
        totalResults: 1,
        page: 1,
        totalPages: 1, // Math.ceil(1 / 10)
      });
    });

    it('should handle empty results', async () => {
      const mockOmdbResponse: OmdbSearchResponse = {
        Search: [],
        totalResults: '0',
        Response: 'True',
      };

      omdbService.searchMovies.mockResolvedValue(mockOmdbResponse);

      const result = await service.listMovies('nonexistentmovie', 1);

      expect(result).toEqual({
        results: [],
        totalResults: 0,
        page: 1,
        totalPages: 0, // Math.ceil(0 / 10)
      });
    });

    it('should calculate total pages correctly for different page sizes', async () => {
      const mockOmdbResponse: OmdbSearchResponse = {
        Search: [],
        totalResults: '47', // Should result in 5 pages (47 / 10 = 4.7 -> 5)
        Response: 'True',
      };

      omdbService.searchMovies.mockResolvedValue(mockOmdbResponse);

      const result = await service.listMovies('test', 2);

      expect(result.totalPages).toBe(5);
      expect(result.page).toBe(2);
      expect(result.totalResults).toBe(47);
    });

    it('should pass correct parameters to omdbService', async () => {
      const mockOmdbResponse: OmdbSearchResponse = {
        Search: [],
        totalResults: '0',
        Response: 'True',
      };

      omdbService.searchMovies.mockResolvedValue(mockOmdbResponse);

      await service.listMovies('superman', 3);

      expect(omdbService.searchMovies).toHaveBeenCalledWith('superman', 3);
      expect(omdbService.searchMovies).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from omdbService', async () => {
      const error = new Error('OMDB API Error');
      omdbService.searchMovies.mockRejectedValue(error);

      await expect(service.listMovies('batman', 1)).rejects.toThrow('OMDB API Error');
    });
  });
});
