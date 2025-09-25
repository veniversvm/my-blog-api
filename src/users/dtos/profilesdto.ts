import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(18)
  age: number;

  @IsOptional()
  @IsNotEmpty()
  avatarUrl: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  id?: number;
}
