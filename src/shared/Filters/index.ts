import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus,} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class CustomException implements ExceptionFilter 
{
  private readonly logger = new Logger('Error');

  catch(exception: HttpException, host: ArgumentsHost) 
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const status =exception instanceof HttpException? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = 
    {
      statusCode: status,
      // path: request.url,
      // statck:exception.stack,
      message:exception instanceof HttpException? exception.getResponse(): (exception as Error).message};

    this.logger.error(`Status: ${status} - Message: ${JSON.stringify(errorResponse.message)}`,(exception as any).stack);

    response.status(status).json(errorResponse);
  }
}
