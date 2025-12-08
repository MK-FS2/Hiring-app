import { CarerExperienceLevels, Currencies, Degrees, IndustriesFeilds, WorkplaceTypes } from "@Shared/Enums";
import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsEnum, Min, IsOptional, IsNotEmpty, Length} from "class-validator";

export class UpdateJobDTO 
{
  @IsString()
  @IsNotEmpty()
  @Length(2,100)
  @IsOptional()
  title:string;

  @IsString()
  @IsNotEmpty()
  @Length(2,400)
  @IsOptional()
  requirements: string; 

  @IsString()
  @IsNotEmpty()
  @Length(2,400)
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({each:true})
  @IsNotEmpty()
  @IsOptional()
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
  @IsOptional()
  experienceLevel: CarerExperienceLevels;

  @IsEnum(WorkplaceTypes)
  @IsNotEmpty()
  @IsOptional()
  workplaceType:WorkplaceTypes;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  minYears: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  maxYears: number;


  @IsOptional()
  @IsEnum(IndustriesFeilds)
  @IsNotEmpty()
  industry: IndustriesFeilds;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  
  @IsOptional()
  city: string;

  @IsOptional()
  @IsEnum(Currencies)
  @IsNotEmpty()
  currency: Currencies;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Degrees)
  degree:Degrees
}