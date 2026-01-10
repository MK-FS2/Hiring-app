import { Module } from '@nestjs/common';
import { JopReportsService } from './jobReports.service';
import { ReportsController } from './reports.controller';
import { JobRecordModule } from '@modules/common';
import { CommonUserModule } from '@Shared/Modules';
import { ApplicationReportService } from './applicationReports.service';
import { ApplicationRecordModule } from '@modules/common/applicationRecord.module';


@Module({
  imports:[CommonUserModule,JobRecordModule,ApplicationRecordModule],
  controllers:[ReportsController],
  providers: [JopReportsService,ApplicationReportService],
})
export class ReportsModule {}
