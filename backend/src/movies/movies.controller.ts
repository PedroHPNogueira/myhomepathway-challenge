import { Controller, Get, Query } from '@nestjs/common';

import { ListMoviesDto } from './dto/list-movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  listMovies(@Query() query: ListMoviesDto) {
    return this.moviesService.listMovies(query.search, query.page ?? 1);
  }
}
