import { Filecount } from '@Shared/Enums';
import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

interface FileDataOptions {
  optional: boolean;
  fieldname?: string;
  filecount:Filecount
}

export const FileData = createParamDecorator((data:FileDataOptions,context:ExecutionContext) => 
    {
    try 
    {
      const {optional,fieldname,filecount} = data;
      const req = context.switchToHttp().getRequest();
      const files = req.files;

      if (!files) 
      {
        if (optional) return null;
        throw new BadRequestException('No files uploaded');
      }

      const target: Express.Multer.File[] | undefined = fieldname ? files[fieldname] : undefined;

      if (!target) 
      {
        if (optional) return null;
        throw new BadRequestException(`${fieldname} file is required`);
      }
      
      if(filecount == Filecount.File)
      {
       return target[0];
      }
      else 
      {
        return target
      }
    } 
    catch (err) 
    {
      throw new InternalServerErrorException(err);
    }
  },
);
