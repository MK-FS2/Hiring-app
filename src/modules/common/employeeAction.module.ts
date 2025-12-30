import { EmployeeAction, EmployeeActionRepository, EmployeeActionSchema } from "@Models/Statistics/EmployeeStatistics/EmployeeActions";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
imports:[MongooseModule.forFeature([{name:EmployeeAction.name,schema:EmployeeActionSchema}])],
providers:[EmployeeActionRepository],
exports:[EmployeeActionRepository]
})
export class EmployeeActionModule{}