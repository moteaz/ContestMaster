import { PartialType } from '@nestjs/mapped-types';
import { CreateContestDto } from './create-contest.dto';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateContestDto extends PartialType(CreateContestDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
