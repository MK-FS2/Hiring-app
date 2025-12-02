import { IndustriesFeilds } from "@Shared/Enums";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";


export class CreateCompanyDTO 
{
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  companyname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  Companyemail: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 400)
  description: string;

  @IsNotEmpty()
  @IsEnum(IndustriesFeilds)
  indstry: IndustriesFeilds;


  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  street: string;      
}
