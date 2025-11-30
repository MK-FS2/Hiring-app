import { FileSchema } from "@Models/common";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";





@Injectable()
export class CloudServices 
{
  private cloudinary = cloudinary;

 constructor(private readonly configService: ConfigService) 
 {
    this.cloudinary.config(
     {
      cloud_name: this.configService.get<string>('cloud.name'),
      api_key: this.configService.get<string>('cloud.apiKey'),
      api_secret: this.configService.get<string>('cloud.secret'),
    });
  }



  // Convert Cloudinary response → your fileformat
private mapCloudinaryToFileFormat(result: UploadApiResponse):FileSchema 
 {
    return {
      ID: result.public_id,
      URL: result.secure_url,
    };
}


async deleteFolder(folder:string): Promise<boolean> 
{
  try 
  {
    await cloudinary.api.delete_resources_by_prefix(folder,{
      resource_type: "image",
    });
    await cloudinary.api.delete_folder(folder);
    return true;
  } 
  catch (err) 
  {
    console.error("Cloudinary folder delete failed:", err);
    return false;
  }
 }

  // Upload a single file
async uploadOne(filePath: string, folder: string): Promise<FileSchema|null> 
  {
    try 
    {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return this.mapCloudinaryToFileFormat(result);
    }
    catch(err)
    {
      console.log(err)
      return null
    }
   
}

 async uploadMany(filePaths: string[], folder: string): Promise<FileSchema[]|null> 
 {
  try 
  {
  const results: FileSchema[] = [];
  for (const path of filePaths) 
  {
    const uploadResult = await cloudinary.uploader.upload(path,{folder});
    const mapped = this.mapCloudinaryToFileFormat(uploadResult);
    results.push(mapped);
  }
  return results;
  }
  catch(err)
  {
  console.log(err)
  return null
  }
}

async DeleteFile(publicId: string): Promise<boolean> 
{
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
}

async ReplaceFile(newfilebath:string,oldfileid:string,folder:string) 
{
  try 
  {
    const UploadNew = await this.uploadOne(newfilebath,folder)
    if (!UploadNew)
    {
      throw new InternalServerErrorException("Replacment failed 1")
    }

    const DeleteOld = await this.DeleteFile(oldfileid)
    if (!DeleteOld)
    {
      await this.DeleteFile(UploadNew.ID)
      throw new InternalServerErrorException(`Replacment failed 2 ${oldfileid}`)
    }

    return UploadNew
  }
  catch(err)
  {
    console.log(err.message)
    return null
  }



}

}
