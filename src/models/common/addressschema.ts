import { Prop, Schema } from "@nestjs/mongoose";




@Schema()
export class Addressschema 
{
    @Prop({ type:String, required:true, minlength:2, maxlength:56 })
    country: string;

    @Prop({ type:String, required:true, minlength:2, maxlength:56 })
    state: string;

    @Prop({ type:String, required:true, minlength:2, maxlength:56 })
    city: string;

    @Prop({ type:String, required:true, minlength:2, maxlength:100 })
    street: string;
}
