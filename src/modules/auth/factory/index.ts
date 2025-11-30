import { Injectable } from "@nestjs/common";
import { MangerDTO } from "../dto";
import { MangerEntity } from "../entity/manger.entity";


@Injectable()
export class AuthFactory 
{

    CreateManger(mangerDTO:MangerDTO)
    {
     const manger = new MangerEntity()

     manger.firstName = mangerDTO.firstName
     manger.lastName = mangerDTO.lastName
     manger.email = mangerDTO.email

     manger.password = mangerDTO.password
     manger.phoneNumber = mangerDTO.phoneNumber
     manger.gender = mangerDTO.gender
     manger.dateofbirth = mangerDTO.dateofbirth

     manger.companyId = mangerDTO.companyId
     manger.hireDate = mangerDTO.hireDate
     return manger
    }



}