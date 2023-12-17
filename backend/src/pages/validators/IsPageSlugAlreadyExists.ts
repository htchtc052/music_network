import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PagesService } from '../pages.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPageSlugAlreadyExists implements ValidatorConstraintInterface {
  constructor(private readonly pagesService: PagesService) {}

  async validate(value: string, args: ValidationArguments) {
    return this.pagesService.checkPageSlugExists(value);
  }
}
