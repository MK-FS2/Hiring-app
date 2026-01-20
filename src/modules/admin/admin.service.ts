import { ConflictException } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BadRequestException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CompanyRepository } from '@Models/Company';
import { Injectable } from '@nestjs/common';
import { DecisionDTO } from './dto';
import { Types } from 'mongoose';
import { MailService } from '@Shared/Utils';

@Injectable()
export class AdminService 
{

constructor(private readonly companyRepository:CompanyRepository,private readonly mailService:MailService){}


async CompaniesTobeConfirmed(page:number,limit:number)
{
const companies = await this.companyRepository.UnconfirmedCompanies(page,limit)
return companies
}

async ApprovalDecision(decisionDTO: DecisionDTO, companyId: Types.ObjectId) {
    const { rejectionNote, decision } = decisionDTO;

    if (decision === false && !rejectionNote) 
        throw new BadRequestException("Rejection Note is required when rejecting");

    const companyExist = await this.companyRepository.FindOne({ _id: companyId, approvedByAdmin:false},{},{populate:{path:"createdby",select:"email"}});
    if (!companyExist) throw new NotFoundException("No company found");


    const result = await this.companyRepository.UpdateOne({_id:companyId},{$set:{approvedByAdmin: decision}});
    if (!result) throw new InternalServerErrorException("Error updating");


    const managerEmail: string = (companyExist.createdby as any).email;

    if (decision) 
    {
    const sendingResult  = await this.mailService.sendCustomMail(managerEmail,"Company Approved","<p>Your company has been approved by the admin.</p>");
    if(!sendingResult)throw new InternalServerErrorException("Sending to Email failed")
    } 
    else 
    {
     const sendingResult = await this.mailService.sendCustomMail(managerEmail,"Company Rejected",`<p>Your company was rejected for the following reason: ${rejectionNote}</p>`);
     if(!sendingResult)
     {
        await this.companyRepository.UpdateOne({_id:companyId},{$set:{approvedByAdmin:false}})
        throw new InternalServerErrorException("Sending to Email failed")
     }
    }
    return true
}

async AllBannedComapies(page:number,limit:number,companyName?:string)
{
    const data = await this.companyRepository.AllBannedCompanies(page,limit,companyName)
    return data
}

async BannedACompany(companyId:Types.ObjectId)
{
const compabyExist = await this.companyRepository.FindOne({_id:companyId,isbanned:false})
if(!compabyExist)throw new NotFoundException("No company Found")

const result = await this.companyRepository.UpdateOne({_id:companyId,isbanned:false},{$set:{isbanned:true}})
if(!result)throw new InternalServerErrorException("Error Updating")

return true
}

async UnBannedACompany(companyId: Types.ObjectId)
 {
    console.log(companyId)
    const companyExist = await this.companyRepository.FindOne({ _id: companyId });
    if (!companyExist) throw new NotFoundException("No company found");
    if (companyExist.isbanned === false) throw new ConflictException("Company is already unbanned");


    const result = await this.companyRepository.UpdateOne({ _id: companyId, isbanned: true },{ $set: { isbanned: false }, $unset: { bannedAt: "" } } );
    if(!result) throw new InternalServerErrorException("Error Updating")

    return true;
}

async AllAppovedComapnies(page:number,limit:number)
{
const Data = await this.companyRepository.ApprovedCompanies(page,limit)

return Data
}


}
