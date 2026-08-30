import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import type { Staff, CreateStaffDto, UpdateStaffDto, StaffListResponse } from '@shared/api.interface';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async getList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('team') team?: string,
    @Query('keyword') keyword?: string,
  ): Promise<StaffListResponse> {
    return this.staffService.getList({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      status,
      team,
      keyword,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Staff> {
    return this.staffService.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto): Promise<Staff> {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.staffService.delete(id);
  }
}
