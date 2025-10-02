import { Injectable } from '@nestjs/common';

import { OmdbService } from '@/omdb/omdb.service';

@Injectable()
export class MoviesService {
  constructor(private readonly omdbService: OmdbService) {}

  listMovies(search: string, page: number) {
    return this.omdbService.searchMovies(search, page);
  }
}
