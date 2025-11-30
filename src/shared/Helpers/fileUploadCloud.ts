import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import multer from 'multer';

function FileUploadCloud(FileTypes:string[], size: number) 
{
  try 
  {
   const storage = multer.diskStorage({});

  const fileFilter = (req: Request,file:Express.Multer.File,cb: multer.FileFilterCallback) => 
  {
    if (!FileTypes.includes(file.mimetype)) 
    {
      return cb(new BadRequestException(`Invalid file type ${file.mimetype}`)); 
    }
    cb(null, true);
  };

  const SizeInMB = size * 1024*1024

  return multer({storage,fileFilter,limits:{fileSize:SizeInMB}});
  }
  catch(err)
  {
   throw new InternalServerErrorException(err.message)
  }
 
}

export default FileUploadCloud;
