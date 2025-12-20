import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";



@Schema()
export class SavedPosts
{
    @Prop({type:SchemaTypes.ObjectId,required:true})
    userId:Types.ObjectId
    
    @Prop({type:SchemaTypes.ObjectId,required:true})
    jobId:Types.ObjectId
}
export const SavedPostsSchema = SchemaFactory.createForClass(SavedPosts) 