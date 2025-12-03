import { Addressschema, FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IndustriesFeilds } from "@Shared/Enums";
import { Types } from "mongoose";

@Schema()
export class CodeSchema 
{
@Prop({type:String,required:true,unique:true})
code:string

@Prop({type:String,required:true})
directedTo:string

@Prop({type:Date,required:false,default:new Date(Date.now()+24*60*60*1000)})
expireAt:Date
}




@Schema({ timestamps:{createdAt:true},toJSON:{virtuals:true},toObject:{virtuals:true}})
export class Company 
{
  @Prop({type:String,required:true,unique:true})
  companyname:string;

  @Prop({type:String,required:true,unique:true})
  Companyemail:string;

  @Prop({type:String,required:true})
  description: string;

  @Prop({ type:String, enum: IndustriesFeilds,required:true})
  indstry: IndustriesFeilds;

  @Prop({type:Number,required:false})
  numberofemployees?: number;

  @Prop({type:Types.ObjectId,required:true,ref:"Manger"})
  createdby?:Types.ObjectId;

  @Prop({type:Addressschema,required:true})
  address: Addressschema;

  @Prop({type:FileSchema,required:false})
  logo?:FileSchema;

  @Prop({type:FileSchema,required:false})
  coverPic?:FileSchema;

  @Prop({type:[Types.ObjectId],required:false,ref:"HR"})
  Hrs?:Types.ObjectId[];

  @Prop({type:[FileSchema],required:false})
  legalDocuments?:FileSchema[];

  @Prop({type:Boolean,required:false,default:false})
  approvedByAdmin?:boolean

  @Prop({type:Date,required:false})
  bannedAt?:Date;

  @Prop({type:Date,required:false})
  deletedAt?: Date;


  @Prop({type:[CodeSchema],required:false,default:[]})
  companycodes?:CodeSchema[]

}

export const CompanySchema = SchemaFactory.createForClass(Company);
