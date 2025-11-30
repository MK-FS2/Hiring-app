import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ISPastDate(validationOptions?:ValidationOptions) 
{
  return function (object: object,propertyName:string) 
  {
    registerDecorator({name:'ISPastDate',target:object.constructor,propertyName,options:validationOptions,
      validator: 
      {
        validate(value:string) 
        {
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          const today = new Date();
          today.setHours(0,0,0,0);

          if(date <= today)
          {
            return true;
          }
          else 
          {
            return false;
          }
        },
        defaultMessage(args:ValidationArguments) 
        {
          return `${args.property} is invalid`;
        }
      }
    });
  };
}
