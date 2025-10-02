import { FavoriteMovies } from '@generated/prisma';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<FavoriteMovies> {
    const existingFavorite = await this.prisma.favoriteMovies.findUnique({
      where: {
        omdbId: createFavoriteDto.omdbId,
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('Movie already in favorites');
    }

    return this.prisma.favoriteMovies.create({
      data: createFavoriteDto,
    });
  }

  findAll(): Promise<FavoriteMovies[]> {
    return this.prisma.favoriteMovies.findMany();
  }

  async remove(id: string): Promise<void> {
    await this.prisma.favoriteMovies.delete({
      where: {
        id,
      },
    });
  }
}
