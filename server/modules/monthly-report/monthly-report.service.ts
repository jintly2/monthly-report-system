import { Inject, Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { eq, and, like, desc, count, or } from 'drizzle-orm';
import { monthlyReport } from '../../database/schema';
import { DRIZZLE_DATABASE } from '../../database/database.module';
import type {
  MonthlyReport,
  CreateMonthlyReportDto,
  UpdateMonthlyReportDto,
  MonthlyReportListResponse,
  DashboardSummary,
  ReviewComment,
} from '@shared/api.interface';

@Injectable()
export class MonthlyReportService {
  constructor(@Inject(DRIZZLE_DATABASE) private readonly db: any) {}

  async getList(params: {
    page: number;
    pageSize: number;
    status?: string;
    month?: string;
    reporterId?: string;
    keyword?: string;
  }): Promise<MonthlyReportListResponse> {
    const { page, pageSize, status, month, reporterId, keyword } = params;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (status) conditions.push(eq(monthlyReport.status, status));
    if (month) conditions.push(eq(monthlyReport.reportMonth, month));
    if (reporterId) conditions.push(eq(monthlyReport.reporterId, reporterId));
    if (keyword) conditions.push(like(monthlyReport.reporterName, `%${keyword}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [itemsResult, countResult] = await Promise.all([
      this.db.select().from(monthlyReport).where(whereClause).orderBy(desc(monthlyReport.reportMonth)).limit(pageSize).offset(offset),
      this.db.select({ count: count() }).from(monthlyReport).where(whereClause),
    ]);

    return {
      items: itemsResult as MonthlyReport[],
      total: Number(countResult[0]?.count || 0),
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<MonthlyReport> {
    const rows = await this.db.select().from(monthlyReport).where(eq(monthlyReport.id, id)).limit(1);
    if (rows.length === 0) throw new NotFoundException('月报不存在');
    return rows[0] as MonthlyReport;
  }

  async create(dto: CreateMonthlyReportDto): Promise<MonthlyReport> {
    const existing = await this.db
      .select()
      .from(monthlyReport)
      .where(and(eq(monthlyReport.reporterId, dto.reporterId), eq(monthlyReport.reportMonth, dto.reportMonth)))
      .limit(1);
    if (existing.length > 0) {
      throw new ConflictException('该月份的月报已存在');
    }

    const inserted = await this.db
      .insert(monthlyReport)
      .values({
        reporterId: dto.reporterId,
        reporterName: dto.reporterName,
        reportMonth: dto.reportMonth,
        performanceItems: dto.performanceItems as any,
        bonusItems: dto.bonusItems as any,
        efficiencyItems: dto.efficiencyItems as any,
        crossDeptCollab: dto.crossDeptCollab || '',
        highlights: dto.highlights || '',
        nextMonthPlan: dto.nextMonthPlan || '',
        resourcesNeeded: dto.resourcesNeeded || '',
        status: dto.status || 'draft',
      })
      .returning();

    return inserted[0] as MonthlyReport;
  }

  async update(id: string, dto: UpdateMonthlyReportDto): Promise<MonthlyReport> {
    const patch: Record<string, any> = {};
    if (dto.performanceItems !== undefined) patch.performanceItems = dto.performanceItems;
    if (dto.bonusItems !== undefined) patch.bonusItems = dto.bonusItems;
    if (dto.efficiencyItems !== undefined) patch.efficiencyItems = dto.efficiencyItems;
    if (dto.crossDeptCollab !== undefined) patch.crossDeptCollab = dto.crossDeptCollab;
    if (dto.highlights !== undefined) patch.highlights = dto.highlights;
    if (dto.nextMonthPlan !== undefined) patch.nextMonthPlan = dto.nextMonthPlan;
    if (dto.resourcesNeeded !== undefined) patch.resourcesNeeded = dto.resourcesNeeded;
    if (dto.status !== undefined) patch.status = dto.status;

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException('未提供可更新字段');
    }

    const updated = await this.db.update(monthlyReport).set(patch).where(eq(monthlyReport.id, id)).returning();
    if (updated.length === 0) throw new NotFoundException('月报不存在');
    return updated[0] as MonthlyReport;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.db.delete(monthlyReport).where(eq(monthlyReport.id, id)).returning();
    if (deleted.length === 0) throw new NotFoundException('月报不存在');
  }

  async addReviewComment(id: string, body: { comment: string; reviewerName: string }): Promise<MonthlyReport> {
    const report = await this.getById(id);
    const comment: ReviewComment = {
      reviewerId: 'admin',
      reviewerName: body.reviewerName || '管理员',
      comment: body.comment,
      reviewedAt: new Date().toISOString(),
    };
    const updatedComments = [...(report.reviewComments || []), comment];
    const newStatus = report.status === 'draft' ? 'submitted' : report.status;

    const updated = await this.db
      .update(monthlyReport)
      .set({ reviewComments: updatedComments as any, status: newStatus })
      .where(eq(monthlyReport.id, id))
      .returning();
    return updated[0] as MonthlyReport;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const allReports: any[] = await this.db.select().from(monthlyReport);

    const totalReports = allReports.length;
    const draftCount = allReports.filter((r: any) => r.status === 'draft').length;
    const submittedCount = allReports.filter((r: any) => r.status === 'submitted').length;
    const reviewedCount = allReports.filter((r: any) => r.status === 'reviewed').length;

    const months = [...new Set(allReports.map((r: any) => r.reportMonth))].sort().reverse();
    const recentMonths = months.slice(0, 6);
    const monthlyStats = recentMonths.map((month) => ({
      month,
      count: allReports.filter((r: any) => r.reportMonth === month).length,
    }));

    let totalPerformanceItems = 0;
    let totalBonusItems = 0;
    let totalEfficiencyItems = 0;

    for (const report of allReports) {
      const perf = Array.isArray((report as any).performanceItems) ? (report as any).performanceItems : [];
      const bonus = Array.isArray((report as any).bonusItems) ? (report as any).bonusItems : [];
      const eff = Array.isArray((report as any).efficiencyItems) ? (report as any).efficiencyItems : [];
      totalPerformanceItems += perf.length;
      totalBonusItems += bonus.length;
      totalEfficiencyItems += eff.length;
    }

    return {
      totalReports,
      draftCount,
      submittedCount,
      reviewedCount,
      totalPerformanceItems,
      totalBonusItems,
      totalEfficiencyItems,
      monthlyStats,
      staffCount: 10,
    };
  }
}
