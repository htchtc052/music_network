import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';

import { IsPageSlugAlreadyExists } from '../validators/IsPageSlugAlreadyExists';
import { IsSlugValid } from '../../commons/isSlugValid.validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePageDto {
  @ApiProperty({ example: 'page title', description: 'Page title' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PAGE_TITLE_NOT_EMPTY'),
  })
  title: string;

  @ApiProperty({ example: 'my_page', description: 'Page slug' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PAGE_SLUG_NOT_EMPTY'),
  })
  @Validate(IsSlugValid, {
    message: i18nValidationMessage('validation.PAGE_SLUG_INVALID'),
  })
  @Validate(IsPageSlugAlreadyExists, {
    message: i18nValidationMessage('validation.PAGE_SLUG_BUSY'),
  })
  slug: string;

  @ApiProperty({ example: 'My awesome page', description: 'Page description' })
  @IsOptional()
  description: string;
}
