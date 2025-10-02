import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Year is required' })
  year: string;

  @IsString()
  @IsNotEmpty()
  poster: string;
}
