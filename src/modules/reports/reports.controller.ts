import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { JopIntervalDTO } from './dto';
import { JopReportsService } from './jobReports.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';


@Controller('reports')
@FullGuard(Roles.Manger)
export class ReportsController 
{
  constructor(private readonly JopReportsService:JopReportsService) {}

  @RolesAllowed(Roles.Manger)
  @Get("jobInterval")
  async JopInterval(@Body() jopIntervalDTO:JopIntervalDTO,@UserData("companyId")companyId:Types.ObjectId)
  {
  const {from,to} = jopIntervalDTO
  const Result = await this.JopReportsService.JopInterval(from,to,companyId)
  return Result
  }
}
