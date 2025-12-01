import { Admin, AdminRepository, AdminSchema, ApplicantRepository, Applicant, ApplicantSchema, BaseUserRepository, HR, HRRepository, HRSchema, Manger, MangerRepository, MangerSchema, User, UserSchema } from "@Models/Users";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
    imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema,discriminators:[{name:Admin.name,schema:AdminSchema},{name:Manger.name,schema:MangerSchema},{name:HR.name,schema:HRSchema},{name:Applicant.name,schema:ApplicantSchema}]}])],
    providers:[BaseUserRepository,MangerRepository,HRRepository,ApplicantRepository,AdminRepository],
    exports:[BaseUserRepository,MangerRepository,HRRepository,ApplicantRepository,AdminRepository],
})
export class CommonUserModule{}