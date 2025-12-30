import { ApplicationRecordRepository, ApplicationRecordSchema} from "@Models/Statistics/ApplicationStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";





@Module({
imports:[MongooseModule.forFeature([{name:ApplicationRecord.name,schema:ApplicationRecordSchema}])],
providers:[ApplicationRecordRepository],
exports:[ApplicationRecordRepository]
})
export class ApplicationRecord {}