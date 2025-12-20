import { MongooseModule } from '@nestjs/mongoose';
import { Module } from "@nestjs/common";
import { SavedPosts, SavedPostsRepository, SavedPostsSchema } from '@Models/SavedJobPosts';



@Module(
{
imports:[MongooseModule.forFeature([{name:SavedPosts.name,schema:SavedPostsSchema}])],
providers:[SavedPostsRepository],
exports:[SavedPostsRepository]
})
export class SavedPostsModule{}