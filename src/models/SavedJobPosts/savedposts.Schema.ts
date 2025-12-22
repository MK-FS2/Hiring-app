import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";



@Schema()
export class SavedPosts
{
    @Prop({type:SchemaTypes.ObjectId,required:true,ref:"Applicant"})
    userId:Types.ObjectId
    
    @Prop({type:SchemaTypes.ObjectId,required:true,ref:"Job"})
    jobId:Types.ObjectId
}
export const SavedPostsSchema = SchemaFactory.createForClass(SavedPosts) 