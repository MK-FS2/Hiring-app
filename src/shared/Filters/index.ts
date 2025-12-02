import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus,} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class CustomException implements ExceptionFilter 
{
  catch(exception:HttpException, host: ArgumentsHost) 
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = 
    {
      statusCode: status,
      path: request.url,
      statck:exception.stack,
      message: exception instanceof HttpException ? exception.getResponse() : (exception as Error).message
    };
    response.status(status).json(errorResponse);
  }
}
