import { Module } from '@nestjs/common';

import { MoviesController } from '@/movies/movies.controller';
import { MoviesService } from '@/movies/movies.service';
import { OmdbModule } from '@/omdb/omdb.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [OmdbModule],
})
export class MoviesModule {}
