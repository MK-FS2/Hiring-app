import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";


export class DecisionDTO 
{

@IsNotEmpty()
@IsBoolean()
decision:boolean


@IsOptional()
@IsString()
@Length(2,400)
rejectionNote?:string

}