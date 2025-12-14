import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { CarerExperienceLevels, Currencies, Degrees, IndustriesFeilds, JobStatus, WorkplaceTypes } from "@Shared/Enums";

@Schema()
export class Job 
{
  @Prop({type:String,required:true})
  title: string;

  @Prop({type:String,required:true})
  requirements:string;

  @Prop({type:String,required:true})
  description:string;

  @Prop({type:[String],default:[]})
  skills: string[];

  @Prop({type:String,required:false,enum:Currencies})
  currency?:Currencies;

  @Prop({type:String,required:true,enum:WorkplaceTypes})
  workplaceType:WorkplaceTypes;

  @Prop({type:Number,required:true,validate: 
    {
    validator: function (value: number) 
    {
      return this.maxYears === undefined || value <= this.maxYears;
    },
    message: (props) => `minYears (${props.value}) cannot be greater than maxYears (${props.instance.maxYears})`
  }
  })
  minYears: number;

  @Prop({type:Number,required:true,validate: 
    {
    validator: function (value: number) 
    {
      return this.minYears === undefined || value >= this.minYears;
    },
    message: (props) => `maxYears (${props.value}) cannot be less than minYears (${props.instance.minYears})`
  }
  })
  maxYears: number;

  @Prop({type: Number,required:false})
  maxSalary?: number;

  @Prop({type: Number,required:false})
  minSalary?: number;

  @Prop({type:String,required:true,enum:IndustriesFeilds})
  industry:IndustriesFeilds;

  @Prop({type:String,required:true})
  city:string;

  @Prop({type:String,required:true})
  country:string;

  @Prop({type:String,required:true,enum:CarerExperienceLevels})
  experienceLevel:CarerExperienceLevels;

  @Prop({type:SchemaTypes.ObjectId,required:true,ref:"HR"})
  createdBy:Types.ObjectId;

  @Prop({type:SchemaTypes.ObjectId,required:false,ref:"HR"})
  updatedBy?:Types.ObjectId;

  @Prop({type:SchemaTypes.ObjectId,required:true,ref:"Company"})
  companyId:Types.ObjectId;

  @Prop({type:Date,required:false,default:new Date()})
  createdAt?:Date;

  @Prop({type:Boolean,required:false,default:false})
  isActive?: boolean;

  @Prop({type:Date,required:true})
  deadline:Date;

  @Prop({type:String,required:false,enum:JobStatus,default:JobStatus.UnderReview })
  status?: JobStatus;
  

  @Prop({type:String,enum:Degrees,required:true})
  degree:Degrees

  //  true mean show for manger aler so he/she can review 
  @Prop({type:Boolean,required:false,default:true})
  mangerAlert?:boolean

  //true mean show for hr aler so he/she can edit 
  @Prop({type:Boolean,required:false,default:false})
  hrAlert?:boolean

  @Prop({type:String,required:function(this:Job)
  {
  if(this.hrAlert == true)
  {
    return true
  }
  else 
  {
    return false
  }
  }
  })
  hrAlertNote?:string

  @Prop({type:Number,required:false,default:0})
  ApplicationsCount?:number
}


export const JobSchema= SchemaFactory.createForClass(Job)