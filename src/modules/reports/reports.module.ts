import { Module } from '@nestjs/common';
import { JopReportsService } from './jobReports.service';
import { JobRecordModule } from '@modules/common';
import { CommonUserModule } from '@Shared/Modules';
import { ApplicationReportService } from './applicationReports.service';
import { ApplicationRecordModule } from '@modules/common/applicationRecord.module';
import { JobReportsController } from './reports.controller';
import { ApplicationReportsController } from './application.controller';


@Module({
  imports:[CommonUserModule,JobRecordModule,ApplicationRecordModule],
  controllers:[JobReportsController,ApplicationReportsController],
  providers:[JopReportsService,ApplicationReportService],
})
export class ReportsModule {}
