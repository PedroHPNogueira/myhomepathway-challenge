import { FavoriteMovies } from '@generated/prisma';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { FavoritesService } from '@/favorites/favorites.service';

@Controller('movies/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto): Promise<FavoriteMovies> {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  findAll(): Promise<FavoriteMovies[]> {
    return this.favoritesService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.favoritesService.remove(id);
  }
}
