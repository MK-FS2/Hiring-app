import { IsBoolean, IsNotEmpty } from "class-validator";


export class ProcessInteviewDTO
{
    @IsBoolean()
    @IsNotEmpty()
    decision:boolean
}