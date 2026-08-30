import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonthlyReportModule } from './modules/monthly-report/monthly-report.module';
import { StaffModule } from './modules/staff/staff.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    StaffModule,
    MonthlyReportModule,
  ],
})
export class AppModule {}
