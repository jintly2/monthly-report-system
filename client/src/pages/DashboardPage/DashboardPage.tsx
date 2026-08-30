import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDashboardSummary } from '@/api/monthly-report';
import type { DashboardSummary } from '@shared/api.interface';
import {
  FileText,
  FileCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  Users,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error('加载看板数据失败:', error);
      // 使用模拟数据
      setSummary({
        totalReports: 13,
        draftCount: 3,
        submittedCount: 7,
        reviewedCount: 3,
        totalPerformanceItems: 28,
        totalBonusItems: 15,
        totalEfficiencyItems: 12,
        monthlyStats: [
          { month: '2025-08', count: 3 },
          { month: '2025-07', count: 10 },
          { month: '2025-06', count: 8 },
          { month: '2025-05', count: 9 },
        ],
        staffCount: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: '月报总数', value: summary?.totalReports || 0, icon: FileText, color: 'blue' },
    { label: '草稿中', value: summary?.draftCount || 0, icon: Clock, color: 'yellow' },
    { label: '已提交', value: summary?.submittedCount || 0, icon: FileCheck, color: 'blue' },
    { label: '已评审', value: summary?.reviewedCount || 0, icon: CheckCircle, color: 'green' },
  ];

  const workStats = [
    { label: '业绩盘点项', value: summary?.totalPerformanceItems || 0, icon: TrendingUp, color: 'blue' },
    { label: '奖金核算项', value: summary?.totalBonusItems || 0, icon: DollarSign, color: 'green' },
    { label: '效益评估项', value: summary?.totalEfficiencyItems || 0, icon: BarChart3, color: 'purple' },
    { label: '部门人数', value: summary?.staffCount || 0, icon: Users, color: 'orange' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 状态统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 工作类型统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>月度提交趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary?.monthlyStats.map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-slate-600">{item.month}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.count / 10) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}份</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 提交进度 */}
        <Card>
          <CardHeader>
            <CardTitle>本月提交进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">总人数</span>
                <Badge variant="default">{summary?.staffCount || 10}人</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">已提交</span>
                <Badge variant="success">{summary?.submittedCount || 0}人</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">草稿中</span>
                <Badge variant="warning">{summary?.draftCount || 0}人</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">已评审</span>
                <Badge variant="success">{summary?.reviewedCount || 0}人</Badge>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">完成率</span>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(((summary?.submittedCount || 0) / (summary?.staffCount || 10)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${((summary?.submittedCount || 0) / (summary?.staffCount || 10)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 三大业务线介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              业绩盘点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              从系统收集销售、财务数据，多维度分析业绩表现，出具业绩报告，提供管理层决策支持。
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              奖金核算
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              基于一线销售业绩进行奖金核算和发放，确保激励有效可落实，关系到每个人切身利益。
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              效益评估
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              以公司政策为指南针，搭建测算模型，对比方案预测成本，提供决策参考。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
