import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

import { IsPageSlugAlreadyExists } from '../validators/IsPageSlugAlreadyExists';
import { IsSlug } from '../../commons/isSlug.validator';

export class CreatePageDto {
  @ApiProperty({ example: 'page title', description: 'Page title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'my_page', description: 'Page slug' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsSlug, { message: 'Page slug invalid format' })
  @Validate(IsPageSlugAlreadyExists, { message: 'Page slug already exists' })
  slug: string;

  @ApiProperty({ example: 'My awesome page', description: 'Page description' })
  @IsOptional()
  description: string;
}
