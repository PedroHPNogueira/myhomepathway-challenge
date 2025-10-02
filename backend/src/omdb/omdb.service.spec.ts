import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { OmdbService } from '@/omdb/omdb.service';

describe('OmdbService', () => {
  let service: OmdbService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmdbService],
    }).compile();

    service = module.get<OmdbService>(OmdbService);
    // Access the private axios instance through reflection
    mockAxios = new MockAdapter((service as unknown as { axiosInstance: AxiosInstance }).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  describe('searchMovies', () => {
    it('should return search results when API responds successfully', async () => {
      const mockResponse = {
        Search: [
          {
            Title: 'Batman',
            Year: '1989',
            imdbID: 'tt0096895',
            Type: 'movie',
            Poster: 'https://example.com/poster.jpg',
          },
        ],
        totalResults: '1',
        Response: 'True',
      };

      mockAxios.onGet('/').reply(200, mockResponse);

      const result = await service.searchMovies('batman');

      expect(result).toEqual(mockResponse);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].params).toMatchObject({
        s: 'batman',
        page: 1,
      });
    });

    it('should throw NotFoundException when movie not found', async () => {
      const mockErrorResponse = {
        Error: 'Movie not found!',
        Response: 'False',
      };

      mockAxios.onGet('/').reply(200, mockErrorResponse);

      await expect(service.searchMovies('nonexistentmovie')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for other API errors', async () => {
      const mockErrorResponse = {
        Error: 'Too many results.',
        Response: 'False',
      };

      mockAxios.onGet('/').reply(200, mockErrorResponse);

      await expect(service.searchMovies('a')).rejects.toThrow(BadRequestException);
    });

    it('should handle pagination correctly', async () => {
      const mockResponse = {
        Search: [],
        totalResults: '0',
        Response: 'True',
      };

      mockAxios.onGet('/').reply(200, mockResponse);

      await service.searchMovies('batman', 2);

      expect(mockAxios.history.get[0].params).toMatchObject({
        s: 'batman',
        page: 2,
      });
    });

    it('should throw InternalServerErrorException on network error', async () => {
      mockAxios.onGet('/').networkError();

      await expect(service.searchMovies('batman')).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException on 401 error', async () => {
      mockAxios.onGet('/').reply(401);

      await expect(service.searchMovies('batman')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
