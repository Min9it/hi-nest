import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

/*
위의 class 선언문과 동일한 구조
export class UpdateMovieDto {
  @IsString()
  readonly title?: string;
  @IsNumber()
  readonly year?: number;
  @IsString({ each: true })
  readonly genres?: string[];
}
*/
