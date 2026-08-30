import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { MonthlyReportService } from './monthly-report.service';
import type {
  CreateMonthlyReportDto,
  UpdateMonthlyReportDto,
  DashboardSummary,
  MonthlyReportListResponse,
  MonthlyReport,
} from '@shared/api.interface';

@Controller('monthly-report')
export class MonthlyReportController {
  constructor(private readonly monthlyReportService: MonthlyReportService) {}

  @Get()
  async getList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('month') month?: string,
    @Query('reporterId') reporterId?: string,
    @Query('keyword') keyword?: string,
  ): Promise<MonthlyReportListResponse> {
    return this.monthlyReportService.getList({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 10,
      status,
      month,
      reporterId,
      keyword,
    });
  }

  @Get('dashboard/summary')
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.monthlyReportService.getDashboardSummary();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<MonthlyReport> {
    return this.monthlyReportService.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateMonthlyReportDto) {
    return this.monthlyReportService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMonthlyReportDto) {
    return this.monthlyReportService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.monthlyReportService.delete(id);
  }

  @Post(':id/review')
  async addReviewComment(@Param('id') id: string, @Body() body: { comment: string; reviewerName: string }) {
    return this.monthlyReportService.addReviewComment(id, body);
  }
}
