import { Injectable } from '@nestjs/common';

import { OmdbService } from '@/omdb/omdb.service';

@Injectable()
export class MoviesService {
  constructor(private readonly omdbService: OmdbService) {}

  async listMovies(search: string, page: number) {
    const omdbResponse = await this.omdbService.searchMovies(search, page);

    const response = {
      results: omdbResponse.Search,
      totalResults: omdbResponse.totalResults,
      page,
      totalPages: Math.ceil(Number(omdbResponse.totalResults) / 10),
    };

    return response;
  }
}
