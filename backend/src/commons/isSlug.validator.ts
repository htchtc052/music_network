import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const IsSlug = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsSlugConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'IsSlug' })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return /^[a-zA-Z0-9_-]+$/.test(value);
  }
}
