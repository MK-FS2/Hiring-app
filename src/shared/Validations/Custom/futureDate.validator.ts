

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ISFutureDate(validationOptions?: ValidationOptions) 
{
  return function (object: object, propertyName: string) 
  {
    registerDecorator({name: 'ISFutureDate',target: object.constructor,propertyName,options: validationOptions,
      validator: 
      {
        validate(value: string) 
        {
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          const today = new Date();
          today.setHours(0,0,0,0);

          return date > today;
        },
        defaultMessage(args: ValidationArguments) 
        {
          return `${args.property} must be a future date`;
        }
      }
    });
  };
}
