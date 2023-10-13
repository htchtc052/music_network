import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsFieldAlreadyExists implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: string, args: ValidationArguments) {
    const fieldName = args.property;
    //console.debug('validate', value, fieldName);
    return this.usersService.checkFieldBusy(fieldName, value);
  }
}
