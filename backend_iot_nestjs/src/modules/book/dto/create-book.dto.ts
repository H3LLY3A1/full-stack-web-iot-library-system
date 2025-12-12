import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsDateString()
  borrowedAt?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
