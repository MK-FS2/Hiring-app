import { Module } from '@nestjs/common';
import { JopReportsService } from './jobReports.service';
import { ReportsController } from './reports.controller';
import { JobRecordModule } from '@modules/common';
import { CommonUserModule } from '@Shared/Modules';

@Module({
  imports:[CommonUserModule,JobRecordModule],
  controllers:[ReportsController],
  providers: [JopReportsService],
})
export class ReportsModule {}
