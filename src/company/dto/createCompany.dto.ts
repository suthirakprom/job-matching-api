import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  jobCategory: string;

  @ApiProperty()
  establishmentDate: string;
}
