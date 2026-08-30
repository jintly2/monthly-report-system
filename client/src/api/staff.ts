import apiClient from './index';
import type { Staff, CreateStaffDto, UpdateStaffDto, StaffListResponse } from '@shared/api.interface';

const BASE_PATH = '/staff';

export async function getStaffList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  team?: string;
  keyword?: string;
}): Promise<StaffListResponse> {
  const { data } = await apiClient.get(BASE_PATH, { params });
  return data;
}

export async function getStaffById(id: string): Promise<Staff> {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

export async function createStaff(dto: CreateStaffDto): Promise<Staff> {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

export async function updateStaff(id: string, dto: UpdateStaffDto): Promise<Staff> {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}`, dto);
  return data;
}

export async function deleteStaff(id: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
