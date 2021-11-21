import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  location?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber?: string;

  @IsOptional()
  @ApiProperty()
  jobCategory?: string;

  @IsOptional()
  @ApiProperty()
  establishmentDate?: string;
}
