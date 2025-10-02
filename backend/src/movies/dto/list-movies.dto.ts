import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class ListMoviesDto {
  @IsString()
  @IsNotEmpty({ message: 'The "search" parameter is required and cannot be empty' })
  search: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsPositive({ message: 'Page must be a positive number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;
}
