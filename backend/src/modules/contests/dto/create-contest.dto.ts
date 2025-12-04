import { IsString, IsDateString, IsOptional, IsInt, Min, IsBoolean, MinLength } from 'class-validator';

export class CreateContestDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCandidates?: number;

  @IsOptional()
  @IsBoolean()
  autoTransition?: boolean;

  @IsString()
  organizerId: string;
}
