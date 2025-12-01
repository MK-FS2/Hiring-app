import {BadRequestException, PipeTransform } from "@nestjs/common";
import { EmailRegex } from "@Shared/Validations";



export class IsValidEmailPipe implements PipeTransform
{
    transform(value:string) 
    {
     if(typeof value === "string" && EmailRegex.test(value)) 
     {
      return value;
     }
     throw new BadRequestException("Invalid email format");
     }
    
}
