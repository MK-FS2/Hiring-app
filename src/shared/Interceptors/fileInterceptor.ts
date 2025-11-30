import { CallHandler, ExecutionContext, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { from, mergeMap, Observable } from "rxjs";
import { Request, Response } from 'express';
import FileUploadCloud from "@Shared/Helpers/fileUploadCloud";
import { Filecount } from "@Shared/Enums";


export interface FilesInterceptType 
{
    Filecount: Filecount;
    Optional: boolean;
    Size: number;
    FileType: string[];
    FieldName: string;
    MaxImagecount: number;
}

export interface FileInterceptType 
{
    Filecount: Filecount;
    Optional: boolean;
    Size: number;
    FileType: string[];
    FieldName: string;
}

export class FilesInterceptor implements NestInterceptor 
{
    constructor(private readonly UploadParams: (FileInterceptType | FilesInterceptType)[]){}

    intercept(context: ExecutionContext,next:CallHandler):Observable<any> 
    {
    const req:Request = context.switchToHttp().getRequest();
    const res:Response = context.switchToHttp().getResponse();

    return new Observable<void>((observer)=>
    {
    const processUpload = async ()=>
    {
    try 
    {
    const params = Array.isArray(this.UploadParams) ? this.UploadParams : [this.UploadParams];
    
    const maxSize = Math.max(...params.map(p => p.Size));
    const allFileTypes = [...new Set(params.flatMap(p => p.FileType))];
    
    const multer = FileUploadCloud(allFileTypes, maxSize);
    
    const fields = this.UploadParams.map((param)=>
    {
    if("MaxImagecount" in param)
    {
        return {name:param.FieldName,maxCount:param.MaxImagecount}
    }
    else 
    {
        return {name:param.FieldName,maxCount:1}
    }
    }) 

    await new Promise<void>((resolve,reject)=>
    {
    const handler = multer.fields(fields)

    handler(req,res,(err: any)=>
    {
    if (err) 
    {
        reject(new InternalServerErrorException(err.message || 'File upload failed'));
        return;
    }

    for (const param of params) 
    {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const uploadedFiles = files?.[param.FieldName];
        
        if("MaxImagecount" in param)
        {
        if (param.Filecount === Filecount.Files && (!uploadedFiles || uploadedFiles.length === 0)) 
        {
            if(param.Optional)
            {
            continue;
            }
            reject(new InternalServerErrorException(`No files uploaded for field: ${param.FieldName}`));
            return;
        }
        }
        else 
        {
        if (param.Filecount === Filecount.File && (!uploadedFiles || uploadedFiles.length === 0)) 
        {
            if(param.Optional)
            {
            continue;
            }
            reject(new InternalServerErrorException(`No file uploaded for field: ${param.FieldName}`));
            return;
        }
        }
    }
    
    resolve();
    })
    })

    observer.next();
    observer.complete();
    } 
    catch (error) 
    {
    observer.error(error);
    }
    };
    void processUpload();
    }).pipe(mergeMap(() => from(next.handle())));
    }
}