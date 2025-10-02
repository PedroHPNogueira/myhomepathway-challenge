/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { FavoriteMovies } from '@generated/prisma';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      favoriteMovies: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    prismaService = module.get(PrismaService);
  });

  describe('create', () => {
    const createFavoriteDto: CreateFavoriteDto = {
      omdbId: 'tt0096895',
      title: 'Batman',
      year: '1989',
      poster: 'https://example.com/poster.jpg',
    };

    it('should create a new favorite movie', async () => {
      const expectedResult: FavoriteMovies = {
        id: '123',
        omdbId: 'tt0096895',
        title: 'Batman',
        year: '1989',
        poster: 'https://example.com/poster.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.favoriteMovies.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.favoriteMovies.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.create(createFavoriteDto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.favoriteMovies.findUnique).toHaveBeenCalledWith({
        where: { omdbId: 'tt0096895' },
      });
      expect(prismaService.favoriteMovies.create).toHaveBeenCalledWith({
        data: createFavoriteDto,
      });
    });

    it('should throw BadRequestException if movie already exists in favorites', async () => {
      const existingFavorite: FavoriteMovies = {
        id: '123',
        omdbId: 'tt0096895',
        title: 'Batman',
        year: '1989',
        poster: 'https://example.com/poster.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.favoriteMovies.findUnique as jest.Mock).mockResolvedValue(existingFavorite);

      await expect(service.create(createFavoriteDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createFavoriteDto)).rejects.toThrow('Movie already in favorites');

      expect(prismaService.favoriteMovies.findUnique).toHaveBeenCalledWith({
        where: { omdbId: 'tt0096895' },
      });
      expect(prismaService.favoriteMovies.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all favorite movies', async () => {
      const expectedResult: FavoriteMovies[] = [
        {
          id: '1',
          omdbId: 'tt0096895',
          title: 'Batman',
          year: '1989',
          poster: 'https://example.com/poster1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          omdbId: 'tt0103776',
          title: 'Batman Returns',
          year: '1992',
          poster: 'https://example.com/poster2.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaService.favoriteMovies.findMany as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(prismaService.favoriteMovies.findMany).toHaveBeenCalledWith();
    });

    it('should return empty array when no favorites exist', async () => {
      (prismaService.favoriteMovies.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.favoriteMovies.findMany).toHaveBeenCalledWith();
    });
  });

  describe('remove', () => {
    it('should remove a favorite movie by id', async () => {
      const movieId = '123';

      (prismaService.favoriteMovies.delete as jest.Mock).mockResolvedValue({} as FavoriteMovies);

      await service.remove(movieId);

      expect(prismaService.favoriteMovies.delete).toHaveBeenCalledWith({
        where: { id: movieId },
      });
    });

    it('should handle deletion of non-existent movie', async () => {
      const movieId = 'non-existent';
      const error = new Error('Record not found');

      (prismaService.favoriteMovies.delete as jest.Mock).mockRejectedValue(error);

      await expect(service.remove(movieId)).rejects.toThrow(error);
      expect(prismaService.favoriteMovies.delete).toHaveBeenCalledWith({
        where: { id: movieId },
      });
    });
  });
});
