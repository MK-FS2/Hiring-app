import { ResetPasswordDTO } from '@modules/auth';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPasswordMatch(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({name:'IsPasswordMatch',target: object.constructor,propertyName,options: validationOptions,validator: 
      {
        validate(value: string, args: ValidationArguments) 
        {
          const dto = args.object as ResetPasswordDTO;
          return value === dto.password;
        },
        defaultMessage(args: ValidationArguments) 
        {
          return `${args.property} must match password`;
        },
      },
    });
  };
}
