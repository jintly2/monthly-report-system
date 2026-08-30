import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, User, Calendar } from 'lucide-react';
import { getMonthlyReportList, addReviewComment } from '@/api/monthly-report';
import type { MonthlyReport } from '@shared/api.interface';

const mockReports: MonthlyReport[] = [
  {
    id: '1',
    reporterId: 'u001',
    reporterName: '张三',
    reportMonth: '2025-07',
    performanceItems: [
      { reportName: '7月华东区业绩分析', dataVolume: '5000条', coverage: '华东区', keyFindings: '增长率超预期' },
    ],
    bonusItems: [],
    efficiencyItems: [],
    crossDeptCollab: '与销售部对接',
    highlights: '发现增长机会',
    nextMonthPlan: '完成8月预测',
    resourcesNeeded: '',
    reviewComments: [
      { reviewerId: 'admin', reviewerName: '孙娟', comment: '分析很深入，建议补充竞品对比', reviewedAt: '2025-08-02 10:30' },
    ],
    status: 'submitted',
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
    highlights: '优化了报表模板',
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
    crossDeptCollab: '与财务部核对',
    highlights: '',
    nextMonthPlan: '',
    resourcesNeeded: '',
    reviewComments: [],
    status: 'submitted',
    createdAt: '2025-07-30',
    updatedAt: '2025-07-31',
  },
];

const ReviewPage: React.FC = () => {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('孙娟');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getMonthlyReportList({ status: 'submitted', pageSize: 50 });
      setReports(data.items.length > 0 ? data.items : mockReports);
    } catch (error) {
      setReports(mockReports);
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedReport || !comment.trim()) return;
    try {
      const updated = await addReviewComment(selectedReport.id, comment, reviewerName);
      setSelectedReport(updated);
      setComment('');
    } catch (error) {
      // 模拟添加
      const newComment = {
        reviewerId: 'admin',
        reviewerName,
        comment,
        reviewedAt: new Date().toLocaleString(),
      };
      setSelectedReport({
        ...selectedReport,
        reviewComments: [...selectedReport.reviewComments, newComment],
      });
      setComment('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="warning">草稿</Badge>;
      case 'submitted':
        return <Badge variant="default">待评审</Badge>;
      case 'reviewed':
        return <Badge variant="success">已评审</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 待评审列表 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              待评审月报 ({reports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report) => (
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
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{report.reportMonth}</span>
                  </div>
                  {report.reviewComments.length > 0 && (
                    <div className="mt-2 text-xs text-blue-600">
                      已有 {report.reviewComments.length} 条评审意见
                    </div>
                  )}
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-8 text-slate-500">暂无待评审月报</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 评审区域 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              评审详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport ? (
              <div className="space-y-6">
                {/* 月报摘要 */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{selectedReport.reporterName}</h3>
                        <p className="text-sm text-slate-500">{selectedReport.reportMonth} 月报</p>
                      </div>
                    </div>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">业绩盘点：</span>
                      <span className="font-medium text-slate-700">{selectedReport.performanceItems.length}项</span>
                    </div>
                    <div>
                      <span className="text-slate-500">奖金核算：</span>
                      <span className="font-medium text-slate-700">{selectedReport.bonusItems.length}项</span>
                    </div>
                    <div>
                      <span className="text-slate-500">效益评估：</span>
                      <span className="font-medium text-slate-700">{selectedReport.efficiencyItems.length}项</span>
                    </div>
                  </div>
                  {selectedReport.highlights && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-sm text-slate-500">本月亮点：</span>
                      <p className="text-sm text-slate-700 mt-1">{selectedReport.highlights}</p>
                    </div>
                  )}
                </div>

                {/* 已有评审意见 */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">评审记录</h4>
                  <div className="space-y-3">
                    {selectedReport.reviewComments.map((rc, i) => (
                      <div key={i} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{rc.reviewerName}</span>
                          <span className="text-xs text-slate-500">{rc.reviewedAt}</span>
                        </div>
                        <p className="text-sm text-slate-700">{rc.comment}</p>
                      </div>
                    ))}
                    {selectedReport.reviewComments.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm">暂无评审意见</div>
                    )}
                  </div>
                </div>

                {/* 添加评审意见 */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-medium text-slate-800 mb-3">添加评审意见</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>评审人</Label>
                      <Input
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="mt-2"
                        placeholder="请输入评审人姓名"
                      />
                    </div>
                    <div>
                      <Label>评审意见</Label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-2"
                        placeholder="请输入评审意见..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        提交评审
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <MessageSquare className="w-12 h-12 mb-4 text-slate-300" />
                <p>点击左侧选择待评审的月报</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPage;
