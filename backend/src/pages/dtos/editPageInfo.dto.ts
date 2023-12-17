import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditPageInfoDto {
  @ApiProperty({ example: 'My page', description: 'Page title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'My awesome page', description: 'Page description' })
  @IsOptional()
  description: string;
}
