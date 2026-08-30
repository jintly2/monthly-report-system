export interface PerformanceItem {
  reportName: string;
  dataVolume: string;
  coverage: string;
  keyFindings: string;
}

export interface BonusItem {
  batchName: string;
  headcount: number;
  amount: string;
  exceptionHandling: string;
  timeliness: string;
}

export interface EfficiencyItem {
  modelName: string;
  policyComparison: string;
  recommendations: string;
  adoptionStatus: string;
}

export interface ReviewComment {
  reviewerId: string;
  reviewerName: string;
  comment: string;
  reviewedAt: string;
}

export interface MonthlyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportMonth: string;
  performanceItems: PerformanceItem[];
  bonusItems: BonusItem[];
  efficiencyItems: EfficiencyItem[];
  crossDeptCollab: string;
  highlights: string;
  nextMonthPlan: string;
  resourcesNeeded: string;
  reviewComments: ReviewComment[];
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonthlyReportDto {
  reporterId: string;
  reporterName: string;
  reportMonth: string;
  performanceItems: PerformanceItem[];
  bonusItems: BonusItem[];
  efficiencyItems: EfficiencyItem[];
  crossDeptCollab?: string;
  highlights?: string;
  nextMonthPlan?: string;
  resourcesNeeded?: string;
  status?: 'draft' | 'submitted' | 'reviewed';
}

export interface UpdateMonthlyReportDto {
  performanceItems?: PerformanceItem[];
  bonusItems?: BonusItem[];
  efficiencyItems?: EfficiencyItem[];
  crossDeptCollab?: string;
  highlights?: string;
  nextMonthPlan?: string;
  resourcesNeeded?: string;
  status?: 'draft' | 'submitted' | 'reviewed';
}

export interface MonthlyReportListResponse {
  items: MonthlyReport[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardSummary {
  totalReports: number;
  draftCount: number;
  submittedCount: number;
  reviewedCount: number;
  totalPerformanceItems: number;
  totalBonusItems: number;
  totalEfficiencyItems: number;
  monthlyStats: { month: string; count: number }[];
  staffCount: number;
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  team: string;
  status: 'active' | 'inactive';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  name: string;
  position: string;
  team: string;
  status?: 'active' | 'inactive';
  userId?: string;
}

export interface UpdateStaffDto {
  name?: string;
  position?: string;
  team?: string;
  status?: 'active' | 'inactive';
  userId?: string;
}

export interface StaffListResponse {
  items: Staff[];
  total: number;
  page: number;
  pageSize: number;
}
