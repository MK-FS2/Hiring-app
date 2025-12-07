import { IsBoolean, IsNotEmpty, IsString, ValidateIf,} from "class-validator";



export class  ReviewJobDTO 
{
    @IsBoolean()
    @IsNotEmpty()
    approval:boolean

    @ValidateIf(obj => obj.approval === false)
    @IsString()
    note:string

}