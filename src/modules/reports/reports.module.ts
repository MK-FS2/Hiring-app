import { Module } from '@nestjs/common';
import { EmployeeActionModule, JobRecordModule } from '@modules/common';
import { CommonUserModule } from '@Shared/Modules';
import { ApplicationRecordModule } from '@modules/common/applicationRecord.module';
import { InterviewReportService } from './Interview/interviewReport.service';
import { ApplicationReportsController } from './Application/application.controller';
import { ApplicationReportService } from './Application/applicationReports.service';
import { JobReportsController } from './Job/jobReport.controller';
import { JopReportsService } from './Job/jobReports.service';
import { InterviewReportsController } from './Interview/interviewReport.controller';
import { InterviewReportModule } from '@modules/common/interviewRecord.module';
import { EmployeeReportsController } from './Employee/employeeReport.controller';
import { EmployeeReportService } from './Employee/employeeReports.service';
import { CompanyModule } from '@modules/company';


@Module({
  imports:[CommonUserModule,JobRecordModule,ApplicationRecordModule,InterviewReportModule,EmployeeActionModule,CompanyModule],
  controllers:[JobReportsController,ApplicationReportsController,InterviewReportsController,EmployeeReportsController],
  providers:[JopReportsService,ApplicationReportService,InterviewReportService,EmployeeReportService],
})
export class ReportsModule {}
