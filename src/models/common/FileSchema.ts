import { Prop, Schema } from "@nestjs/mongoose"


@Schema({timestamps:false,_id:false})
export class FileSchema
{
    @Prop({type:String,required:true})
    ID:string
    @Prop({type:String,required:true})
    URL:string
}
