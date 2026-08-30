import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { getMonthlyReportList } from '@/api/monthly-report';
import type { MonthlyReport } from '@shared/api.interface';

const mockReports: MonthlyReport[] = [
  {
    id: '1',
    reporterId: 'u001',
    reporterName: '张三',
    reportMonth: '2025-07',
    performanceItems: [
      { reportName: '7月华东区业绩分析', dataVolume: '5000条', coverage: '华东区', keyFindings: '增长率超预期' },
      { reportName: '7月产品线对比分析', dataVolume: '3000条', coverage: '全产品线', keyFindings: 'A产品线下滑' },
    ],
    bonusItems: [
      { batchName: '7月销售奖金', headcount: 150, amount: '120万', exceptionHandling: '无异常', timeliness: '按时发放' },
    ],
    efficiencyItems: [
      { modelName: '新政策测算', policyComparison: '对比了3套方案', recommendations: '推荐方案B', adoptionStatus: '已采纳' },
    ],
    crossDeptCollab: '与销售部对接业绩数据',
    highlights: '发现华东区增长机会',
    nextMonthPlan: '完成8月业绩预测',
    resourcesNeeded: '',
    reviewComments: [],
    status: 'reviewed',
    createdAt: '2025-08-01',
    updatedAt: '2025-08-02',
  },
  {
    id: '2',
    reporterId: 'u002',
    reporterName: '李四',
    reportMonth: '2025-07',
    performanceItems: [
      { reportName: '7月华南区业绩分析', dataVolume: '4000条', coverage: '华南区', keyFindings: '渠道效率提升' },
    ],
    bonusItems: [],
    efficiencyItems: [],
    crossDeptCollab: '',
    highlights: '优化了数据报表模板',
    nextMonthPlan: '',
    resourcesNeeded: '',
    reviewComments: [],
    status: 'submitted',
    createdAt: '2025-08-01',
    updatedAt: '2025-08-01',
  },
  {
    id: '3',
    reporterId: 'u003',
    reporterName: '王五',
    reportMonth: '2025-07',
    performanceItems: [],
    bonusItems: [
      { batchName: '7月奖金核算', headcount: 200, amount: '180万', exceptionHandling: '处理3笔异常', timeliness: '延迟1天' },
    ],
    efficiencyItems: [],
    crossDeptCollab: '与财务部核对发放明细',
    highlights: '',
    nextMonthPlan: '',
    resourcesNeeded: '',
    reviewComments: [],
    status: 'draft',
    createdAt: '2025-07-30',
    updatedAt: '2025-07-31',
  },
];

const ReportQueryPage: React.FC = () => {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);
  const [filters, setFilters] = useState({ month: '', status: '', keyword: '' });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getMonthlyReportList({ pageSize: 50 });
      setReports(data.items.length > 0 ? data.items : mockReports);
    } catch (error) {
      setReports(mockReports);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filters.month && r.reportMonth !== filters.month) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.keyword && !r.reporterName.includes(filters.keyword)) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="warning">草稿</Badge>;
      case 'submitted':
        return <Badge variant="default">已提交</Badge>;
      case 'reviewed':
        return <Badge variant="success">已评审</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 筛选条件 */}
      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>月份</Label>
              <Input
                type="month"
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>状态</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-2"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">全部</option>
                <option value="draft">草稿</option>
                <option value="submitted">已提交</option>
                <option value="reviewed">已评审</option>
              </select>
            </div>
            <div>
              <Label>姓名关键词</Label>
              <Input
                placeholder="输入姓名搜索"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({ month: '', status: '', keyword: '' })}
              >
                重置筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 月报列表 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              月报列表 ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{report.reporterName}</span>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{report.reportMonth}</p>
                  <div className="flex gap-2 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {report.performanceItems.length}项
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {report.bonusItems.length}项
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {report.efficiencyItems.length}项
                    </span>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-slate-500">暂无符合条件的月报</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 月报详情 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              月报详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {selectedReport.reporterName} - {selectedReport.reportMonth}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      更新时间：{selectedReport.updatedAt}
                    </p>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>

                <Tabs defaultValue="performance">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="performance">业绩盘点 ({selectedReport.performanceItems.length})</TabsTrigger>
                    <TabsTrigger value="bonus">奖金核算 ({selectedReport.bonusItems.length})</TabsTrigger>
                    <TabsTrigger value="efficiency">效益评估 ({selectedReport.efficiencyItems.length})</TabsTrigger>
                    <TabsTrigger value="general">通用信息</TabsTrigger>
                  </TabsList>

                  <TabsContent value="performance" className="mt-4 space-y-4">
                    {selectedReport.performanceItems.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800">{item.reportName || '未命名'}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-slate-500">数据量：</span>
                            <span className="text-slate-700">{item.dataVolume || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">覆盖范围：</span>
                            <span className="text-slate-700">{item.coverage || '-'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500">关键发现：</span>
                            <span className="text-slate-700">{item.keyFindings || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedReport.performanceItems.length === 0 && (
                      <div className="text-center py-8 text-slate-500">暂无业绩盘点工作</div>
                    )}
                  </TabsContent>

                  <TabsContent value="bonus" className="mt-4 space-y-4">
                    {selectedReport.bonusItems.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800">{item.batchName || '未命名'}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-slate-500">涉及人数：</span>
                            <span className="text-slate-700">{item.headcount}人</span>
                          </div>
                          <div>
                            <span className="text-slate-500">核算金额：</span>
                            <span className="text-slate-700">{item.amount || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">发放及时性：</span>
                            <span className="text-slate-700">{item.timeliness || '-'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500">异常处理：</span>
                            <span className="text-slate-700">{item.exceptionHandling || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedReport.bonusItems.length === 0 && (
                      <div className="text-center py-8 text-slate-500">暂无奖金核算工作</div>
                    )}
                  </TabsContent>

                  <TabsContent value="efficiency" className="mt-4 space-y-4">
                    {selectedReport.efficiencyItems.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800">{item.modelName || '未命名'}</h4>
                        <div className="space-y-2 mt-3 text-sm">
                          <div>
                            <span className="text-slate-500">方案对比：</span>
                            <span className="text-slate-700">{item.policyComparison || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">决策建议：</span>
                            <span className="text-slate-700">{item.recommendations || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">采纳情况：</span>
                            <span className="text-slate-700">{item.adoptionStatus || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedReport.efficiencyItems.length === 0 && (
                      <div className="text-center py-8 text-slate-500">暂无效益评估工作</div>
                    )}
                  </TabsContent>

                  <TabsContent value="general" className="mt-4 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">跨部门协作</h4>
                      <p className="text-sm text-slate-700">{selectedReport.crossDeptCollab || '暂无'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">本月亮点</h4>
                      <p className="text-sm text-slate-700">{selectedReport.highlights || '暂无'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">下月计划</h4>
                      <p className="text-sm text-slate-700">{selectedReport.nextMonthPlan || '暂无'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-800 mb-2">资源需求</h4>
                      <p className="text-sm text-slate-700">{selectedReport.resourcesNeeded || '暂无'}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Eye className="w-12 h-12 mb-4 text-slate-300" />
                <p>点击左侧列表查看月报详情</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportQueryPage;
