import {BadGatewayException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";



export class ValidMongoID implements PipeTransform 
{
    transform(value:any) 
    {
    if(!value)
    {
     throw new BadGatewayException("param is required")
    }

    if(typeof value !== "string")
    {
    throw new BadGatewayException("invalid param format") 
    }

    if(!Types.ObjectId.isValid(value))
    {
    throw new BadGatewayException("invalid param format") 
    }
    
    return new Types.ObjectId(value)
    }
}