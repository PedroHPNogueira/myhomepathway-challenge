import { Controller, Get, Query } from '@nestjs/common';

import { ListMoviesDto } from '@/movies/dto/list-movies.dto';
import { MoviesService } from '@/movies/movies.service';
import { OmdbMovie, PaginatedResponse } from '@/types';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  listMovies(@Query() query: ListMoviesDto): Promise<PaginatedResponse<OmdbMovie>> {
    return this.moviesService.listMovies(query.search, query.page ?? 1);
  }
}
