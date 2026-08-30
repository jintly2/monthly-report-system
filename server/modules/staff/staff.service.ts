import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, like, desc, count, or } from 'drizzle-orm';
import { staff } from '../../database/schema';
import { DRIZZLE_DATABASE } from '../../database/database.module';
import type { Staff, CreateStaffDto, UpdateStaffDto, StaffListResponse } from '@shared/api.interface';

@Injectable()
export class StaffService {
  constructor(@Inject(DRIZZLE_DATABASE) private readonly db: any) {}

  async getList(params: {
    page: number;
    pageSize: number;
    status?: string;
    team?: string;
    keyword?: string;
  }): Promise<StaffListResponse> {
    const { page, pageSize, status, team, keyword } = params;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (status) conditions.push(eq(staff.status, status));
    if (team) conditions.push(eq(staff.team, team));
    if (keyword) {
      conditions.push(or(like(staff.name, `%${keyword}%`), like(staff.position, `%${keyword}%`)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [itemsResult, countResult] = await Promise.all([
      this.db.select().from(staff).where(whereClause).orderBy(desc(staff.createdAt)).limit(pageSize).offset(offset),
      this.db.select({ count: count() }).from(staff).where(whereClause),
    ]);

    return {
      items: itemsResult as Staff[],
      total: Number(countResult[0]?.count || 0),
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<Staff> {
    const rows = await this.db.select().from(staff).where(eq(staff.id, id)).limit(1);
    if (rows.length === 0) throw new NotFoundException('员工不存在');
    return rows[0] as Staff;
  }

  async create(dto: CreateStaffDto): Promise<Staff> {
    const inserted = await this.db
      .insert(staff)
      .values({
        name: dto.name,
        position: dto.position,
        team: dto.team,
        status: dto.status || 'active',
        userId: dto.userId || null,
      })
      .returning();
    return inserted[0] as Staff;
  }

  async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const patch: Record<string, any> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.position !== undefined) patch.position = dto.position;
    if (dto.team !== undefined) patch.team = dto.team;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.userId !== undefined) patch.userId = dto.userId || null;

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException('未提供可更新字段');
    }

    const updated = await this.db.update(staff).set(patch).where(eq(staff.id, id)).returning();
    if (updated.length === 0) throw new NotFoundException('员工不存在');
    return updated[0] as Staff;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.db.delete(staff).where(eq(staff.id, id)).returning();
    if (deleted.length === 0) throw new NotFoundException('员工不存在');
  }
}
