import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ISMilitaryTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ISMilitaryTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;

          const militaryTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return militaryTimeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid military time (HH:mm)`;
        },
      },
    });
  };
}