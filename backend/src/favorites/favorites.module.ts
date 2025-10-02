import { Module } from '@nestjs/common';

import { FavoritesController } from '@/favorites/favorites.controller';
import { FavoritesService } from '@/favorites/favorites.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [PrismaModule],
})
export class FavoritesModule {}
