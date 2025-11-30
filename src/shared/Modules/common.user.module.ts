import { Admin, AdminRepository, AdminSchema, ApplicanRepository, Applicant, ApplicantSchema, BaseUserRepository, HR, HRRepository, HRSchema, Manger, MangerRepository, MangerSchema, User, UserShema } from "@Models/Users";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
    imports:[MongooseModule.forFeature([{name:User.name,schema:UserShema,discriminators:[{name:Admin.name,schema:AdminSchema},{name:Manger.name,schema:MangerSchema},{name:HR.name,schema:HRSchema},{name:Applicant.name,schema:ApplicantSchema}]}])],
    providers:[BaseUserRepository,MangerRepository,HRRepository,ApplicanRepository,AdminRepository],
    exports:[BaseUserRepository,MangerRepository,HRRepository,ApplicanRepository,AdminRepository],
})
export class CommonUserModule{}