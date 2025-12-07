import { CarerExperienceLevels, Currencies, Degrees, IndustriesFeilds, WorkplaceTypes } from "@Shared/Enums";
import { ISFutureDate} from "@Shared/Validations";
import { Type } from "class-transformer";
import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsEnum, Min, IsOptional, IsNotEmpty, Length, IsDate } from "class-validator";

export class AddJobDTO 
{
  @IsString()
  @IsNotEmpty()
  @Length(2,100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(2,400)
  requirements: string; 

  @IsString()
  @IsNotEmpty()
  @Length(2,400)
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({each:true})
  @IsNotEmpty()
  skills:string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  mingsalary: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxsalary: number;

  @IsEnum(CarerExperienceLevels)
  @IsNotEmpty()
  experienceLevel: CarerExperienceLevels;

  @IsEnum(WorkplaceTypes)
  @IsNotEmpty()
  workplaceType:WorkplaceTypes;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minYears: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  maxYears: number;

  @IsEnum(IndustriesFeilds)
  @IsNotEmpty()
  industry: IndustriesFeilds;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(Currencies)
  @IsNotEmpty()
  currency: Currencies;

  @IsNotEmpty()
  @IsDate()
  @ISFutureDate()
  @Type(() => Date)
  deadline: Date;


  @IsNotEmpty()
  @IsEnum(Degrees)
  degree:Degrees
  
}
