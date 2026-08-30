import apiClient from './index';
import type {
  MonthlyReport,
  CreateMonthlyReportDto,
  UpdateMonthlyReportDto,
  MonthlyReportListResponse,
  DashboardSummary,
} from '@shared/api.interface';

const BASE_PATH = '/monthly-report';

export async function getMonthlyReportList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  month?: string;
  reporterId?: string;
  keyword?: string;
}): Promise<MonthlyReportListResponse> {
  const { data } = await apiClient.get(BASE_PATH, { params });
  return data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get(`${BASE_PATH}/dashboard/summary`);
  return data;
}

export async function getMonthlyReportById(id: string): Promise<MonthlyReport> {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

export async function createMonthlyReport(dto: CreateMonthlyReportDto): Promise<MonthlyReport> {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

export async function updateMonthlyReport(id: string, dto: UpdateMonthlyReportDto): Promise<MonthlyReport> {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}`, dto);
  return data;
}

export async function deleteMonthlyReport(id: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}

export async function addReviewComment(id: string, comment: string, reviewerName: string): Promise<MonthlyReport> {
  const { data } = await apiClient.post(`${BASE_PATH}/${id}/review`, { comment, reviewerName });
  return data;
}
