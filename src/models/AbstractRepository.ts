import { HydratedDocument, Model, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";


export default class AbstractRepository<T>
{
constructor(private readonly model:Model<T>){}

async CreatDocument(Document:T):Promise<null|HydratedDocument<T>>
{
 const creationresult = await this.model.create(Document)
  if(!creationresult)
  {
    return null
  }
  else 
  {
    return creationresult
  }

}

async Exist(Filter:RootFilterQuery<T>,Projection?:ProjectionType<T>,Options?:QueryOptions<T>):Promise<boolean>
{
   const Result =  await this.model.findOne(Filter,Projection,Options)
    if(!Result)
    {
        return false
    }
    else 
    {
        return true
    }
}

async FindOne(Filter:RootFilterQuery<T>,Projection?:ProjectionType<T>,Options?:QueryOptions<T>):Promise<null|HydratedDocument<T>>
{
    const Result = await this.model.findOne(Filter,Projection,Options)
     return Result
}

async Find(Filter:RootFilterQuery<T>,Projection?:ProjectionType<T>,Options?:QueryOptions<T>):Promise<null |HydratedDocument<T>[]>
{
    const Results = await this.model.find(Filter,Projection,Options)
    if(Results.length == 0)
    {
        return null
    }
    else 
    {
      return Results
    }
}

async UpdateOne(Filter:RootFilterQuery<T>,Updateoptions:UpdateQuery<T>,Options?: Record<string, any>):Promise<boolean>
{
    const UpdateResult = await this.model.updateOne(Filter,Updateoptions,Options)

    if(UpdateResult.modifiedCount == 0)
    {
        return false
    }
    else 
    {
        return true
    }
}

async UpdateMany(Filter: RootFilterQuery<T>,UpdateOptions: UpdateQuery<T>): Promise<boolean> {
  const UpdateResult = await this.model.updateMany(Filter, UpdateOptions);
  if (UpdateResult.modifiedCount === 0) 
  {
    return false;
  } 
  else 
  {
    return true;
  }
}

async DeleteOne(filter: RootFilterQuery<T>):Promise<boolean> 
{
  const result = await this.model.deleteOne(filter);
  return result.deletedCount > 0;
}

async DeleteMany(Filter: RootFilterQuery<T>): Promise<boolean> 
{
  const Result = await this.model.deleteMany(Filter);

  if (Result.deletedCount === 0) 
  {
  return false;
  } 
  else 
  {
    return true;
   }
}


async CountDocuments(Filter:RootFilterQuery<T>)
{
const result = await this.model.countDocuments(Filter)
return result
}

}