import { TokenRepository } from '@Models/Token';
import { BaseUserRepository } from '@Models/Users';
import { Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronTasksService 
{
  private readonly logger = new Logger(CronTasksService.name);
  constructor(private readonly tokenRepository:TokenRepository,private readonly baseUserRepository:BaseUserRepository){}

 @Cron(CronExpression.EVERY_DAY_AT_2AM) 
async DeleteOldTokens() {
  try 
  {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    await this.tokenRepository.DeleteMany({createdAt:{$lt:cutoffDate}});
  } 
  catch (error) 
  {
    this.logger.error('Failed to delete old tokens', error.stack);
  }
}

@Cron(CronExpression.EVERY_DAY_AT_2AM) 
async DeleteUnconfirmedUsers() {
  try 
  {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 4); 

     await this.baseUserRepository.DeleteMany({isVerified:false,createdAt:{$lt:cutoffDate}});
  } 
  catch (error) 
  {
    this.logger.error('Failed to delete unconfirmed users', error.stack);
  }
}

}